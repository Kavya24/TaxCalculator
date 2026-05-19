import { useAppState } from '../../context/AppContext'
import { validateLimit, formatCurrency, LIMITS } from '../../utils/validation'
import './StepForm.css'

export default function Step5({ onNext, onBack }) {
  const { state, dispatch } = useAppState()
  const { homeLoan } = state

  function updateLoan(payload) {
    dispatch({ type: 'UPDATE_HOME_LOAN', payload })
  }

  function handleNum(field, val) {
    const raw = val.replace(/,/g, '')
    const num = parseInt(raw, 10)
    updateLoan({ [field]: isNaN(num) ? null : num })
  }

  // Validation
  const vInterest = homeLoan.propertyType === 'self-occupied'
    ? validateLimit(homeLoan.annualInterest, LIMITS.MAX_HOME_LOAN_INT_SELF, 'Self-occupied interest')
    : { isValid: true }

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 5 of 8</span>
        <h2 className="sf-title">Do you have an active home loan?</h2>
        <p className="sf-desc">
          Home loan interest on a self-occupied property gives up to ₹2 lakh deduction in the Old Regime.
        </p>
      </div>

      <div className="sf-body">
        <div className="sf-radio-group">
          <label className={`sf-radio-card ${homeLoan.hasHomeLoan === true ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              checked={homeLoan.hasHomeLoan === true}
              onChange={() => updateLoan({ hasHomeLoan: true })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Yes</span>
            </span>
          </label>
          <label className={`sf-radio-card ${homeLoan.hasHomeLoan === false ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              checked={homeLoan.hasHomeLoan === false}
              onChange={() => updateLoan({
                hasHomeLoan: false,
                propertyType: null,
                annualInterest: null,
                annualRentalIncome: null,
                annualPrincipalRepaid: null
              })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">No</span>
            </span>
          </label>
        </div>

        {homeLoan.hasHomeLoan && (
          <div className="sf-sub-panel">
            <div className="sf-input-wrap">
              <label className="sf-label">Property Type</label>
              <div className="sf-radio-group">
                <label className={`sf-radio-card ${homeLoan.propertyType === 'self-occupied' ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    checked={homeLoan.propertyType === 'self-occupied'}
                    onChange={() => updateLoan({ propertyType: 'self-occupied', annualRentalIncome: null })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">Self-Occupied</span>
                    <span className="sf-radio-desc">I live in it</span>
                  </span>
                </label>
                <label className={`sf-radio-card ${homeLoan.propertyType === 'let-out' ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    checked={homeLoan.propertyType === 'let-out'}
                    onChange={() => updateLoan({ propertyType: 'let-out' })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">Let Out</span>
                    <span className="sf-radio-desc">Given on rent</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="loan-interest">Annual Interest Paid</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="loan-interest"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${vInterest.message ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 210000"
                  value={formatCurrency(homeLoan.annualInterest)}
                  onChange={(e) => handleNum('annualInterest', e.target.value)}
                />
              </div>
              {vInterest.message && <p className="sf-error-msg">{vInterest.message}</p>}
              {vInterest.warning && <p className="sf-warning-msg">⚠️ {vInterest.warning}</p>}
            </div>

            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="loan-principal">Annual Principal Repaid</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="loan-principal"
                  type="text"
                  inputMode="numeric"
                  className="sf-input"
                  placeholder="e.g. 50000"
                  value={formatCurrency(homeLoan.annualPrincipalRepaid)}
                  onChange={(e) => handleNum('annualPrincipalRepaid', e.target.value)}
                />
              </div>
              <p className="sf-hint">This counts towards your 80C limit (Old Regime).</p>
            </div>

            {homeLoan.propertyType === 'let-out' && (
              <div className="sf-input-wrap">
                <label className="sf-label" htmlFor="rental-income">Annual Rental Income Received</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    id="rental-income"
                    type="text"
                    inputMode="numeric"
                    className="sf-input"
                    placeholder="e.g. 180000"
                    value={formatCurrency(homeLoan.annualRentalIncome)}
                    onChange={(e) => handleNum('annualRentalIncome', e.target.value)}
                  />
                </div>
                <p className="sf-hint">This is added to your income in both regimes (after 30% standard deduction).</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sf-nav">
        <button className="btn-secondary sf-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn-primary sf-next-btn"
          onClick={onNext}
          disabled={homeLoan.hasHomeLoan && homeLoan.propertyType == null}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

