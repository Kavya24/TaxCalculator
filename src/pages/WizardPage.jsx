import { useState, useRef } from 'react'
import { useAppState } from '../context/AppContext'
import { useComputedTax } from '../hooks/useComputedTax'
import ProgressBar from '../components/ProgressBar'
import LivePreviewPanel from '../components/LivePreviewPanel'
import MobileTaxBar from '../components/MobileTaxBar'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import Step7 from './steps/Step7'
import Step8 from './steps/Step8'
import './WizardPage.css'

const STEP_COMPONENTS = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  5: Step5,
  6: Step6,
  7: Step7,
  8: Step8,
}

export default function WizardPage({ onGoHome, onComplete }) {
  const { state, dispatch } = useAppState()
  const { wizardStep } = state

  useComputedTax() // Auto-recomputes tax on every state change

  // Slide direction: 'forward' | 'backward'
  const [slideDir, setSlideDir] = useState('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showStartOverDialog, setShowStartOverDialog] = useState(false)
  const contentRef = useRef(null)

  /* ── Navigate forward ──────────────────────────────────── */
  function goNext() {
    if (isAnimating) return
    if (wizardStep >= 8) {
      onComplete()
      return
    }
    setSlideDir('forward')
    setIsAnimating(true)
    setTimeout(() => {
      dispatch({ type: 'SET_WIZARD_STEP', payload: wizardStep + 1 })
      setIsAnimating(false)
    }, 200)
  }

  /* ── Navigate backward ─────────────────────────────────── */
  function goBack() {
    if (isAnimating) return
    if (wizardStep <= 1) {
      onGoHome()
      return
    }
    setSlideDir('backward')
    setIsAnimating(true)
    setTimeout(() => {
      dispatch({ type: 'SET_WIZARD_STEP', payload: wizardStep - 1 })
      setIsAnimating(false)
    }, 200)
  }

  /* ── Start Over ─────────────────────────────────────────── */
  function confirmStartOver() {
    dispatch({ type: 'RESET' })
    setShowStartOverDialog(false)
    onGoHome()
  }

  const StepComponent = STEP_COMPONENTS[wizardStep]

  const slideClass = isAnimating
    ? (slideDir === 'forward' ? 'wizard-slide-out-left' : 'wizard-slide-out-right')
    : (slideDir === 'forward' ? 'wizard-slide-in-right' : 'wizard-slide-in-left')

  return (
    <div className="wiz-root">

      {/* ── Sticky top bar: Back + Progress + Start Over ──── */}
      <div className="wiz-topbar">
        <div className="container wiz-topbar-inner">
          {/* Back button */}
          <button
            className="wiz-back-btn"
            onClick={goBack}
            aria-label={wizardStep === 1 ? 'Back to home' : 'Back to previous step'}
          >
            ← {wizardStep === 1 ? 'Home' : 'Back'}
          </button>

          {/* Progress bar (takes centre) */}
          <div className="wiz-progress-wrap">
            <ProgressBar currentStep={wizardStep} />
          </div>

          {/* Start Over */}
          <button
            className="wiz-startover-btn"
            onClick={() => setShowStartOverDialog(true)}
            aria-label="Start over from the beginning"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* ── Main layout: 65% content + 35% preview ──────── */}
      <div className="container wiz-body">

        {/* Step content */}
        <main className="wiz-content">
          <div
            key={wizardStep}
            ref={contentRef}
            className={`wiz-step-wrap ${slideClass}`}
          >
            <StepComponent onNext={goNext} onBack={goBack} />
          </div>
        </main>

        {/* Live preview panel (desktop only — mobile uses MobileTaxBar) */}
        <aside className="wiz-preview">
          <LivePreviewPanel currentStep={wizardStep} />
        </aside>

      </div>

      {/* ── Mobile sticky bottom bar ─────────────────────── */}
      <MobileTaxBar currentStep={wizardStep} />

      {/* ── Start Over confirmation dialog ───────────────── */}
      {showStartOverDialog && (
        <div className="wiz-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="wiz-dialog">
            <h3 id="dialog-title" className="wiz-dialog-title">Start over?</h3>
            <p className="wiz-dialog-body">
              All your entered information will be cleared. You'll go back to the beginning.
            </p>
            <div className="wiz-dialog-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowStartOverDialog(false)}
                autoFocus
              >
                Keep going
              </button>
              <button
                className="btn-primary"
                onClick={confirmStartOver}
                style={{ background: 'var(--danger)' }}
              >
                Yes, start over
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
