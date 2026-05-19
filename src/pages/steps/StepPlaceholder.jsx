import './StepPlaceholder.css'

/* Reusable placeholder for wizard steps 1-8 during Phase 3.
   Each step will get its own full implementation in later phases. */
export default function StepPlaceholder({ stepNum, title, icon, description, onNext, onBack }) {
  return (
    <div className="sp-root animate-fade-in">
      <div className="sp-icon">{icon}</div>
      <div className="sp-step-label">Step {stepNum} of 8</div>
      <h2 className="sp-title">{title}</h2>
      <p className="sp-desc">{description}</p>

      <div className="sp-coming-badge">
        🚧 Full form coming in Phase {stepNum <= 3 ? 5 : stepNum <= 6 ? 6 : stepNum <= 8 ? 7 : 5}
      </div>

      <div className="sp-nav">
        {onBack && (
          <button className="btn-secondary sp-back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
        <button className="btn-primary sp-next-btn" onClick={onNext}>
          {stepNum === 8 ? 'See Results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
