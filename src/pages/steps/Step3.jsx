import { useAppState } from '../../context/AppContext'
import { validatePF, formatCurrency } from '../../utils/validation'
import './StepForm.css'

export default function Step3({ onNext }) {
  const { state, dispatch } = useAppState()
  const { pf } = state

  function updatePF(payload) {
    dispatch({ type: 'UPDATE_PF', payload })
  }

  const { isValid: isPFValid, warning: pfWarning, message: pfError } = 
    validatePF(pf.monthlyPFDeduction)

  let canProceed = false
  if (pf.hasPF === false || pf.hasPF === 'not_sure') {
    canProceed = true
  } else if (pf.hasPF === true && isPFValid && !pfError) {
    canProceed = true
  }

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 3 of 8</span>
        <h2 className="sf-title">Does your company deduct PF from your salary?</h2>
        <p className="sf-desc">
          Your EPF contribution is automatically eligible for Section 80C deduction in the Old Regime.
        </p>
      </div>

      <div className="sf-body">
        {/* Has PF? */}
        <div className="sf-radio-group">
          <label className={`sf-radio-card ${pf.hasPF === true ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="hasPF"
              checked={pf.hasPF === true}
              onChange={() => updatePF({ hasPF: true })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Yes</span>
            </span>
          </label>
          <label className={`sf-radio-card ${pf.hasPF === false ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="hasPF"
              checked={pf.hasPF === false}
              onChange={() => updatePF({ hasPF: false, monthlyPFDeduction: null })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">No</span>
            </span>
          </label>
          <label className={`sf-radio-card ${pf.hasPF === 'not_sure' ? 'sf-radio-card--active' : ''}`} style={{ gridColumn: 'span 2' }}>
            <input
              type="radio"
              name="hasPF"
              checked={pf.hasPF === 'not_sure'}
              onChange={() => updatePF({ hasPF: 'not_sure', monthlyPFDeduction: null })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Not Sure</span>
              <span className="sf-radio-desc">We'll assume standard 12% of basic for estimations.</span>
            </span>
          </label>
        </div>

        {/* If Yes -> Monthly deduction */}
        {pf.hasPF === true && (
          <div className="sf-sub-panel">
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="pf-amount">Your Monthly PF Deduction</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="pf-amount"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${pfError ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 1800"
                  value={formatCurrency(pf.monthlyPFDeduction)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '')
                    const num = parseInt(raw, 10)
                    updatePF({ monthlyPFDeduction: isNaN(num) ? null : num })
                  }}
                />
              </div>
              {pfError && <p className="sf-error-msg">{pfError}</p>}
              {pfWarning && <p className="sf-warning-msg">⚠️ {pfWarning}</p>}
              <p className="sf-hint">Enter YOUR contribution only, not the employer's. Max is usually 12% of basic.</p>
            </div>
          </div>
        )}
      </div>

      <div className="sf-nav">
        <button
          className="btn-primary sf-next-btn"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
