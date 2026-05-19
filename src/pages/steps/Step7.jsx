import { useAppState } from '../../context/AppContext'
import { validateLimit, formatCurrency, LIMITS } from '../../utils/validation'
import './StepForm.css'

export default function Step7({ onNext, onBack }) {
  const { state, dispatch } = useAppState()
  const { other } = state

  function updateOther(payload) {
    dispatch({ type: 'UPDATE_OTHER', payload })
  }

  function handleNum(field, val) {
    const raw = val.replace(/,/g, '')
    const num = parseInt(raw, 10)
    updateOther({ [field]: isNaN(num) ? null : num })
  }

  // Validation
  const vProfTax = validateLimit(other.professionalTaxAnnual, LIMITS.MAX_PROF_TAX, 'Professional Tax')

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 7 of 8</span>
        <h2 className="sf-title">Almost done! Any other deductions?</h2>
        <p className="sf-desc">
          The standard deduction is already applied automatically. Let's capture Professional Tax and LTA.
        </p>
      </div>

      <div className="sf-body">
        
        {/* Professional Tax */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">Does your company deduct Professional Tax?</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${other.hasProfessionalTax === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={other.hasProfessionalTax === true}
                  onChange={() => updateOther({ hasProfessionalTax: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${other.hasProfessionalTax === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={other.hasProfessionalTax === false}
                  onChange={() => updateOther({ hasProfessionalTax: false, professionalTaxAnnual: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {other.hasProfessionalTax && (
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="prof-tax">Annual Professional Tax (usually ₹2,400)</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="prof-tax"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${vProfTax.message ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 2400"
                  value={formatCurrency(other.professionalTaxAnnual)}
                  onChange={(e) => handleNum('professionalTaxAnnual', e.target.value)}
                />
              </div>
              {vProfTax.message && <p className="sf-error-msg">{vProfTax.message}</p>}
              {vProfTax.warning && <p className="sf-warning-msg">⚠️ {vProfTax.warning}</p>}
              <p className="sf-hint">This reduces your taxable income in BOTH regimes.</p>
            </div>
          )}
        </div>

        {/* LTA */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">Are you claiming Leave Travel Allowance (LTA)?</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${other.hasLTA === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={other.hasLTA === true}
                  onChange={() => updateOther({ hasLTA: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${other.hasLTA === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={other.hasLTA === false}
                  onChange={() => updateOther({ hasLTA: false, ltaAnnual: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {other.hasLTA && (
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="lta-amount">LTA Claim Amount</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="lta-amount"
                  type="text"
                  inputMode="numeric"
                  className="sf-input"
                  placeholder="e.g. 35000"
                  value={formatCurrency(other.ltaAnnual)}
                  onChange={(e) => handleNum('ltaAnnual', e.target.value)}
                />
              </div>
              <p className="sf-hint">Old Regime only. Valid for 2 domestic trips in a 4-year block.</p>
            </div>
          )}
        </div>

        {/* Miscellaneous */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label" htmlFor="other-deduct">Any other deductions? (Optional)</label>
            <div className="sf-input-icon-wrap">
              <span className="sf-input-icon">₹</span>
              <input
                id="other-deduct"
                type="text"
                inputMode="numeric"
                className="sf-input"
                placeholder="e.g. 10000"
                value={formatCurrency(other.otherDeductions)}
                onChange={(e) => handleNum('otherDeductions', e.target.value)}
              />
            </div>
            <p className="sf-hint">Donation to charities (80G), electric vehicle loan (80EEB), etc. (Old Regime only).</p>
          </div>
        </div>

      </div>

      <div className="sf-nav">
        <button className="btn-secondary sf-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-primary sf-next-btn" onClick={onNext}>
          Next →
        </button>
      </div>
    </div>
  )
}

