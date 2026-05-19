import { useState } from 'react'
import { AppProvider, useAppState } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import WizardPage from './pages/WizardPage'
import ResultsPage from './pages/ResultsPage'
import './App.css'

/* ── Inner app uses context ──────────────────────────────── */
function AppInner() {
  const { dispatch } = useAppState()

  // Top-level screen: 'landing' | 'wizard' | 'results'
  const [screen, setScreen] = useState('landing')

  function handleStart() {
    dispatch({ type: 'RESET' })
    setScreen('wizard')
  }

  function handleGoHome() {
    setScreen('landing')
  }

  function handleComplete() {
    setScreen('results')
  }

  function handleRecalculate() {
    setScreen('wizard')
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Site Nav ──────────────────────────────────── */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        position: 'sticky',
        top: 0,
        zindex: 100,
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>
          {/* Logo */}
          <button
            onClick={handleGoHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Go to home"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'white',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              ₹
            </div>
            <span style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--neutral-900)',
              letterSpacing: '-0.02em',
            }}>
              TaxClarity
            </span>
            <span className="badge badge-primary" style={{ marginLeft: 'var(--space-1)' }}>
              FY 2025-26
            </span>
          </button>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--neutral-500)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}>
              🔒 100% Private
            </span>

            {screen === 'landing' && (
              <button
                className="btn-primary"
                onClick={handleStart}
                style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-5)' }}
              >
                Start Calculator →
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Screens ───────────────────────────────────── */}
      <div id="main-content">
        {screen === 'landing' && (
          <LandingPage onStart={handleStart} />
        )}

        {screen === 'wizard' && (
          <WizardPage
            onGoHome={handleGoHome}
            onComplete={handleComplete}
          />
        )}

        {screen === 'results' && (
          <ResultsPage
            onRecalculate={handleRecalculate}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </>
  )
}

/* ── Root wraps everything in context ────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
