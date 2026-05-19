import { useAppState } from '../../context/AppContext'
import { validateSalary, formatCurrency } from '../../utils/validation'
import './StepForm.css'

export default function Step1({ onNext }) {
  const { state, dispatch } = useAppState()
  const { takeHomeSalary } = state

  const val = takeHomeSalary.amount
  const freq = takeHomeSalary.frequency

  const { isValid, warning, message } = validateSalary(val, freq)

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/,/g, '')
    const num = parseInt(raw, 10)
    dispatch({
      type: 'UPDATE_TAKE_HOME',
      payload: { amount: isNaN(num) ? null : num }
    })
  }

  function handleFreqChange(newFreq) {
    let newAmount = val
    if (val && freq === 'monthly' && newFreq === 'annual') newAmount = val * 12
    if (val && freq === 'annual' && newFreq === 'monthly') newAmount = Math.round(val / 12)
    
    dispatch({
      type: 'UPDATE_TAKE_HOME',
      payload: { frequency: newFreq, amount: newAmount }
    })
  }

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 1 of 8</span>
        <h2 className="sf-title">How much money hits your bank account?</h2>
        <p className="sf-desc">
          Enter the exact amount you receive in your account after all company deductions (like PF and TDS).
        </p>
      </div>

      <div className="sf-body">
        {/* Frequency Toggle */}
        <div className="sf-radio-group" style={{ marginBottom: 'var(--space-6)' }}>
          <label className={`sf-radio-card ${freq === 'monthly' ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="salaryFreq"
              checked={freq === 'monthly'}
              onChange={() => handleFreqChange('monthly')}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Monthly</span>
              <span className="sf-radio-desc">Every month</span>
            </span>
          </label>
          <label className={`sf-radio-card ${freq === 'annual' ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="salaryFreq"
              checked={freq === 'annual'}
              onChange={() => handleFreqChange('annual')}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Annual</span>
              <span className="sf-radio-desc">Total per year</span>
            </span>
          </label>
        </div>

        {/* Amount Input */}
        <div className="sf-input-wrap">
          <label className="sf-label" htmlFor="salary-amount">
            {freq === 'monthly' ? 'Net Monthly In-Hand' : 'Net Annual In-Hand'}
          </label>
          <div className="sf-input-icon-wrap">
            <span className="sf-input-icon">₹</span>
            <input
              id="salary-amount"
              type="text"
              inputMode="numeric"
              className={`sf-input sf-input--large ${message ? 'sf-input--error' : ''}`}
              placeholder={freq === 'monthly' ? "e.g. 85000" : "e.g. 1020000"}
              value={formatCurrency(val)}
              onChange={handleAmountChange}
              autoFocus
            />
          </div>
          {message && <p className="sf-error-msg">{message}</p>}
          {warning && <p className="sf-warning-msg">⚠️ {warning}</p>}
          {!message && !warning && (
            <p className="sf-hint">
              💡 Check your latest salary credit SMS or bank statement.
            </p>
          )}
        </div>
      </div>

      <div className="sf-nav">
        <button
          className="btn-primary sf-next-btn"
          onClick={onNext}
          disabled={!isValid || !!message}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

