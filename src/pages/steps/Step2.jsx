import { useAppState } from '../../context/AppContext'
import { validateRent, formatCurrency } from '../../utils/validation'
import './StepForm.css'

export default function Step2({ onNext }) {
  const { state, dispatch } = useAppState()
  const { rent, takeHomeSalary } = state

  function updateRent(payload) {
    dispatch({ type: 'UPDATE_RENT', payload })
  }

  // Validation logic
  const { isValid: isRentValid, warning: rentWarning, message: rentError } = 
    validateRent(rent.monthlyRent, takeHomeSalary.amount, takeHomeSalary.frequency)

  let canProceed = false
  if (rent.paysRent === false) {
    canProceed = true
  } else if (rent.paysRent === true) {
    if (isRentValid && !rentError && rent.city != null) {
      if (rent.receivesHRA === false) canProceed = true
      if (rent.receivesHRA === true && rent.hraAmount > 0) canProceed = true
    }
  }

  return (
    <div className="sf-root animate-fade-in">
      <div className="sf-header">
        <span className="sf-step-label">Step 2 of 8</span>
        <h2 className="sf-title">Do you pay rent for the place you live in?</h2>
        <p className="sf-desc">
          House Rent Allowance (HRA) is one of the biggest tax savers in the Old Regime.
        </p>
      </div>

      <div className="sf-body">
        {/* Do you pay rent? */}
        <div className="sf-radio-group">
          <label className={`sf-radio-card ${rent.paysRent === true ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="paysRent"
              checked={rent.paysRent === true}
              onChange={() => updateRent({ paysRent: true })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">Yes</span>
            </span>
          </label>
          <label className={`sf-radio-card ${rent.paysRent === false ? 'sf-radio-card--active' : ''}`}>
            <input
              type="radio"
              name="paysRent"
              checked={rent.paysRent === false}
              onChange={() => updateRent({
                paysRent: false,
                monthlyRent: null,
                city: null,
                receivesHRA: null,
                hraAmount: null
              })}
            />
            <span className="sf-radio-content">
              <span className="sf-radio-title">No</span>
            </span>
          </label>
        </div>

        {/* If Yes -> Show Rent Details Sub-panel */}
        {rent.paysRent && (
          <div className="sf-sub-panel">
            <div className="sf-input-wrap">
              <label className="sf-label" htmlFor="monthly-rent">Monthly Rent Paid</label>
              <div className="sf-input-icon-wrap">
                <span className="sf-input-icon">₹</span>
                <input
                  id="monthly-rent"
                  type="text"
                  inputMode="numeric"
                  className={`sf-input ${rentError ? 'sf-input--error' : ''}`}
                  placeholder="e.g. 15000"
                  value={formatCurrency(rent.monthlyRent)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '')
                    const num = parseInt(raw, 10)
                    updateRent({ monthlyRent: isNaN(num) ? null : num })
                  }}
                />
              </div>
              {rentError && <p className="sf-error-msg">{rentError}</p>}
              {rentWarning && <p className="sf-warning-msg">⚠️ {rentWarning}</p>}
            </div>

            <div className="sf-input-wrap">
              <label className="sf-label">Where do you live?</label>
              <div className="sf-radio-group">
                <label className={`sf-radio-card ${rent.city === 'metro' ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    name="cityType"
                    checked={rent.city === 'metro'}
                    onChange={() => updateRent({ city: 'metro' })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">Metro</span>
                    <span className="sf-radio-desc">Delhi, Mumbai, Chennai, Kolkata</span>
                  </span>
                </label>
                <label className={`sf-radio-card ${rent.city === 'non-metro' ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    name="cityType"
                    checked={rent.city === 'non-metro'}
                    onChange={() => updateRent({ city: 'non-metro' })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">Non-Metro</span>
                    <span className="sf-radio-desc">Bengaluru, Pune, Hyderabad, etc.</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="sf-input-wrap">
              <label className="sf-label">Is HRA included in your salary slip?</label>
              <div className="sf-radio-group">
                <label className={`sf-radio-card ${rent.receivesHRA === true ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    name="receivesHRA"
                    checked={rent.receivesHRA === true}
                    onChange={() => updateRent({ receivesHRA: true })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">Yes</span>
                  </span>
                </label>
                <label className={`sf-radio-card ${rent.receivesHRA === false ? 'sf-radio-card--active' : ''}`}>
                  <input
                    type="radio"
                    name="receivesHRA"
                    checked={rent.receivesHRA === false}
                    onChange={() => updateRent({ receivesHRA: false, hraAmount: null })}
                  />
                  <span className="sf-radio-content">
                    <span className="sf-radio-title">No</span>
                  </span>
                </label>
              </div>
              <p className="sf-hint">If no, you can claim 80GG later (up to ₹60,000/yr).</p>
            </div>

            {rent.receivesHRA && (
              <div className="sf-input-wrap">
                <label className="sf-label" htmlFor="hra-amount">Annual HRA Received</label>
                <div className="sf-input-icon-wrap">
                  <span className="sf-input-icon">₹</span>
                  <input
                    id="hra-amount"
                    type="text"
                    inputMode="numeric"
                    className="sf-input"
                    placeholder="e.g. 120000"
                    value={formatCurrency(rent.hraAmount)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, '')
                      const num = parseInt(raw, 10)
                      updateRent({ hraAmount: isNaN(num) ? null : num })
                    }}
                  />
                </div>
                <p className="sf-hint">Check your Form 16 or multiply monthly HRA by 12.</p>
              </div>
            )}
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
