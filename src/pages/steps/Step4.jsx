import { useAppState } from '../../context/AppContext'
import { validateLimit, formatCurrency, LIMITS } from '../../utils/validation'
import './StepForm.css'

export default function Step4({ onNext, onBack }) {
  const { state, dispatch } = useAppState()
  const { investments, pf } = state

  function updateInvest(payload) {
    dispatch({ type: 'UPDATE_INVESTMENTS', payload })
  }

  // Helper for numeric inputs
  function handleNum(field, val) {
    const raw = val.replace(/,/g, '')
    const num = parseInt(raw, 10)
    updateInvest({ [field]: isNaN(num) ? null : num })
  }

  // Pre-fill PF contribution if available
  const estimatedPF = pf.hasPF === true && pf.monthlyPFDeduction
    ? pf.monthlyPFDeduction * 12
    : 0

  // Validations
  const v80C = validateLimit(investments.investments80C, LIMITS.MAX_80C, 'Section 80C')
  const v80D_Self = validateLimit(investments.healthInsuranceSelf, LIMITS.MAX_80D_SELF, 'Section 80D (Self)')
  const v80D_Parents = validateLimit(
    investments.healthInsuranceParents, 
    investments.parentsAreSeniorCitizens ? LIMITS.MAX_80D_PARENTS_SENIOR : LIMITS.MAX_80D_PARENTS, 
    'Section 80D (Parents)'
  )

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 4 of 8</span>
        <h2 className="sf-title">Do you have any of these tax-saving investments?</h2>
        <p className="sf-desc">
          These deductions primarily apply to the Old Regime. You can skip if you don't have them.
        </p>
      </div>

      <div className="sf-body">

        {/* 1. 80C Investments */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">1. Section 80C Investments (LIC, ELSS, PPF, etc.)</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${investments.has80C === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.has80C === true}
                  onChange={() => updateInvest({ has80C: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${investments.has80C === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.has80C === false}
                  onChange={() => updateInvest({ has80C: false, investments80C: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {investments.has80C && (
            <div className="sf-input-wrap">
              <label className="sf-label">Total 80C Amount (Annual)</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${v80C.message ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 150000"
                  value={formatCurrency(investments.investments80C)}
                  onChange={(e) => handleNum('investments80C', e.target.value)}
                />
              </div>
              {v80C.message && <p className="sf-error-msg">{v80C.message}</p>}
              {v80C.warning && <p className="sf-warning-msg">⚠️ {v80C.warning}</p>}
              <p className="sf-hint">
                {estimatedPF > 0
                  ? `💡 Include your PF (approx ₹${formatCurrency(estimatedPF)}/yr). Max deduction is ₹1.5L.`
                  : "💡 Max deduction is ₹1.5L."}
              </p>
            </div>
          )}
        </div>

        {/* 2. Health Insurance (80D) */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">2. Health Insurance Premiums (80D)</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${investments.hasHealthInsurance === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasHealthInsurance === true}
                  onChange={() => updateInvest({ hasHealthInsurance: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${investments.hasHealthInsurance === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasHealthInsurance === false}
                  onChange={() => updateInvest({
                    hasHealthInsurance: false,
                    healthInsuranceSelf: null,
                    healthInsuranceParents: null,
                    parentsAreSeniorCitizens: false
                  })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {investments.hasHealthInsurance && (
            <>
              <div className="sf-input-wrap">
                <label className="sf-label">Premium for Self & Family</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`sf-input ${v80D_Self.message ? 'sf-input--error' : ''}`}
                    placeholder="e.g. 15000"
                    value={formatCurrency(investments.healthInsuranceSelf)}
                    onChange={(e) => handleNum('healthInsuranceSelf', e.target.value)}
                  />
                </div>
                {v80D_Self.message && <p className="sf-error-msg">{v80D_Self.message}</p>}
                {v80D_Self.warning && <p className="sf-warning-msg">⚠️ {v80D_Self.warning}</p>}
              </div>
              <div className="sf-input-wrap">
                <label className="sf-label">Premium for Parents</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`sf-input ${v80D_Parents.message ? 'sf-input--error' : ''}`}
                    placeholder="e.g. 20000"
                    value={formatCurrency(investments.healthInsuranceParents)}
                    onChange={(e) => handleNum('healthInsuranceParents', e.target.value)}
                  />
                </div>
                {v80D_Parents.message && <p className="sf-error-msg">{v80D_Parents.message}</p>}
                {v80D_Parents.warning && <p className="sf-warning-msg">⚠️ {v80D_Parents.warning}</p>}
              </div>
              {(investments.healthInsuranceParents > 0) && (
                <label className="sf-radio-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <input
                    type="checkbox"
                    style={{ position: 'relative', opacity: 1, width: 'auto', height: 'auto', cursor: 'pointer' }}
                    checked={investments.parentsAreSeniorCitizens}
                    onChange={(e) => updateInvest({ parentsAreSeniorCitizens: e.target.checked })}
                  />
                  <span className="sf-radio-title" style={{ fontSize: 'var(--text-sm)' }}>Are any of your parents senior citizens (60+)?</span>
                </label>
              )}
            </>
          )}
        </div>

        {/* 3. Education Loan (80E) */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">3. Education Loan Interest (80E)</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${investments.hasEducationLoan === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasEducationLoan === true}
                  onChange={() => updateInvest({ hasEducationLoan: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${investments.hasEducationLoan === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasEducationLoan === false}
                  onChange={() => updateInvest({ hasEducationLoan: false, educationLoanInterest: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {investments.hasEducationLoan && (
            <div className="sf-input-wrap">
              <label className="sf-label">Annual Interest Paid</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="sf-input"
                  placeholder="e.g. 40000"
                  value={formatCurrency(investments.educationLoanInterest)}
                  onChange={(e) => handleNum('educationLoanInterest', e.target.value)}
                />
              </div>
              <p className="sf-hint">Enter the interest portion only, not the principal.</p>
            </div>
          )}
        </div>

        {/* 4. Savings / FD Interest (80TTA / 80TTB) */}
        <div className="sf-sub-panel">
          <div className="sf-input-wrap">
            <label className="sf-label">4. Interest from Savings Accounts or FDs</label>
            <div className="sf-radio-group">
              <label className={`sf-radio-card ${investments.hasSavingsInterest === true ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasSavingsInterest === true}
                  onChange={() => updateInvest({ hasSavingsInterest: true })}
                />
                <span className="sf-radio-title">Yes</span>
              </label>
              <label className={`sf-radio-card ${investments.hasSavingsInterest === false ? 'sf-radio-card--active' : ''}`}>
                <input
                  type="radio"
                  checked={investments.hasSavingsInterest === false}
                  onChange={() => updateInvest({ hasSavingsInterest: false, savingsAccountInterest: null, fdInterestEarned: null })}
                />
                <span className="sf-radio-title">No</span>
              </label>
            </div>
          </div>
          {investments.hasSavingsInterest && (
            <>
              <div className="sf-input-wrap">
                <label className="sf-label">Savings Account Interest (Annual)</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="sf-input"
                    placeholder="e.g. 5000"
                    value={formatCurrency(investments.savingsAccountInterest)}
                    onChange={(e) => handleNum('savingsAccountInterest', e.target.value)}
                  />
                </div>
                <p className="sf-hint">Up to ₹10,000 is tax-free in Old Regime (80TTA).</p>
              </div>
              <div className="sf-input-wrap">
                <label className="sf-label">Fixed Deposit (FD) Interest (Annual)</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="sf-input"
                    placeholder="e.g. 12000"
                    value={formatCurrency(investments.fdInterestEarned)}
                    onChange={(e) => handleNum('fdInterestEarned', e.target.value)}
                  />
                </div>
                <p className="sf-hint">This is added to your taxable income in BOTH regimes.</p>
              </div>
            </>
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

