import { useAppState } from '../../context/AppContext'
import { validateNPS, formatCurrency } from '../../utils/validation'
import './StepForm.css'

export default function Step6({ onNext, onBack }) {
  const { state, dispatch } = useAppState()
  const { nps, takeHomeSalary } = state

  function updateNPS(payload) {
    dispatch({ type: 'UPDATE_NPS', payload })
  }

  function handleNum(field, val) {
    const raw = val.replace(/,/g, '')
    const num = parseInt(raw, 10)
    updateNPS({ [field]: isNaN(num) ? null : num })
  }

  // Validations
  const vEmployer = validateNPS(nps.employerNPSAnnual, takeHomeSalary.amount * 12, 'employer')
  const vOwn = validateNPS(nps.ownNPSAnnual, null, 'own')

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 6 of 8</span>
        <h2 className="sf-title">Do you or your employer invest in NPS?</h2>
        <p className="sf-desc">
          Employer NPS contributions are tax-free in <strong>BOTH</strong> regimes (up to 10% of basic salary).
        </p>
      </div>

      <div className="sf-body">
        
        {/* Employer NPS */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">Does your EMPLOYER contribute to your NPS?</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${nps.hasEmployerNPS === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={nps.hasEmployerNPS === true}
                  onChange={() => updateNPS({ hasEmployerNPS: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${nps.hasEmployerNPS === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={nps.hasEmployerNPS === false}
                  onChange={() => updateNPS({ hasEmployerNPS: false, employerNPSAnnual: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {nps.hasEmployerNPS && (
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="employer-nps">Employer Annual Contribution</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="employer-nps"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${vEmployer.message ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 50000"
                  value={formatCurrency(nps.employerNPSAnnual)}
                  onChange={(e) => handleNum('employerNPSAnnual', e.target.value)}
                />
              </div>
              {vEmployer.message && <p className="sf-error-msg">{vEmployer.message}</p>}
              {vEmployer.warning && <p className="sf-warning-msg">⚠️ {vEmployer.warning}</p>}
              <p className="sf-hint">This is Section 80CCD(2). It works in the New Regime too!</p>
            </div>
          )}
        </div>

        {/* Own NPS */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">Do YOU voluntarily contribute to NPS?</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${nps.hasOwnNPS === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={nps.hasOwnNPS === true}
                  onChange={() => updateNPS({ hasOwnNPS: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${nps.hasOwnNPS === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={nps.hasOwnNPS === false}
                  onChange={() => updateNPS({ hasOwnNPS: false, ownNPSAnnual: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {nps.hasOwnNPS && (
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="own-nps">Your Annual Contribution</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="own-nps"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${vOwn.message ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 50000"
                  value={formatCurrency(nps.ownNPSAnnual)}
                  onChange={(e) => handleNum('ownNPSAnnual', e.target.value)}
                />
              </div>
              {vOwn.message && <p className="sf-error-msg">{vOwn.message}</p>}
              {vOwn.warning && <p className="sf-warning-msg">⚠️ {vOwn.warning}</p>}
              <p className="sf-hint">This gives an extra ₹50,000 deduction under 80CCD(1B) in the Old Regime only.</p>
            </div>
          )}
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

