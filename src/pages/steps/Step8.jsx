import { useAppState } from '../../context/AppContext'
import './StepForm.css'

export default function Step8({ onNext, onBack }) {
  const { state, dispatch } = useAppState()
  const { ageGroup } = state

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 8 of 8</span>
        <h2 className="sf-title">Final question: How old are you?</h2>
        <p className="sf-desc">
          Your age affects the basic exemption limit in the Old Regime. (Age as of 31st March 2026).
        </p>
      </div>

      <div className="sf-body">
        <div className="sf-input-wrap">
          <div className="sf-radio-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label className={`sf-radio-card ${ageGroup === 'below-60' ? 'sf-radio-card--active' : ''}`}>
              <input
                type="radio"
                checked={ageGroup === 'below-60'}
                onChange={() => dispatch({ type: 'UPDATE_AGE_GROUP', payload: 'below-60' })}
              />
              <span className="sf-radio-content">
                <span className="sf-radio-title">Below 60 years</span>
                <span className="sf-radio-desc">Standard basic exemption limit (₹2.5L in Old Regime).</span>
              </span>
            </label>

            <label className={`sf-radio-card ${ageGroup === 'senior' ? 'sf-radio-card--active' : ''}`}>
              <input
                type="radio"
                checked={ageGroup === 'senior'}
                onChange={() => dispatch({ type: 'UPDATE_AGE_GROUP', payload: 'senior' })}
              />
              <span className="sf-radio-content">
                <span className="sf-radio-title">60 to 79 years (Senior Citizen)</span>
                <span className="sf-radio-desc">Higher basic exemption limit (₹3L in Old Regime).</span>
              </span>
            </label>

            <label className={`sf-radio-card ${ageGroup === 'super-senior' ? 'sf-radio-card--active' : ''}`}>
              <input
                type="radio"
                checked={ageGroup === 'super-senior'}
                onChange={() => dispatch({ type: 'UPDATE_AGE_GROUP', payload: 'super-senior' })}
              />
              <span className="sf-radio-content">
                <span className="sf-radio-title">80 years and above (Super Senior)</span>
                <span className="sf-radio-desc">Highest basic exemption limit (₹5L in Old Regime).</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="sf-nav" style={{ marginTop: 'var(--space-6)' }}>
        <button className="btn-secondary sf-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn-primary sf-next-btn"
          onClick={onNext}
          disabled={!ageGroup}
          style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
        >
          See Results →
        </button>
      </div>
    </div>
  )
}
