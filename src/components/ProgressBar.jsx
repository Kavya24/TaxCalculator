import './ProgressBar.css'

const STEP_LABELS = ['Salary', 'Rent', 'PF', 'Invest', 'Loan', 'NPS', 'Other', 'Age']
const TOTAL_STEPS = 8

export default function ProgressBar({ currentStep }) {
  return (
    <div className="pb-root" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}>

      {/* Mobile: text indicator */}
      <div className="pb-mobile-text">
        Step <strong>{currentStep}</strong> of {TOTAL_STEPS} — {STEP_LABELS[currentStep - 1]}
      </div>

      {/* Segment track */}
      <div className="pb-track" aria-hidden="true">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isDone    = stepNum < currentStep
          const isActive  = stepNum === currentStep
          const isUpcoming = stepNum > currentStep

          return (
            <div key={label} className="pb-segment-wrap">
              {/* Segment bar */}
              <div
                className={[
                  'pb-segment',
                  isDone    ? 'pb-segment--done'    : '',
                  isActive  ? 'pb-segment--active'  : '',
                  isUpcoming ? 'pb-segment--upcoming' : '',
                ].join(' ')}
              >
                {/* Animated fill for active step */}
                {isActive && <div className="pb-segment-pulse" />}
              </div>

              {/* Step dot + label (desktop only) */}
              <div className={`pb-dot-wrap ${isActive ? 'pb-dot-wrap--active' : ''}`}>
                <div className={[
                  'pb-dot',
                  isDone    ? 'pb-dot--done'    : '',
                  isActive  ? 'pb-dot--active'  : '',
                ].join(' ')}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`pb-label ${isActive ? 'pb-label--active' : ''} ${isDone ? 'pb-label--done' : ''}`}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
