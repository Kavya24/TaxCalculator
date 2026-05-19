import { useState } from 'react'
import { useAppState } from '../context/AppContext'
import './ResultsPage.css'

function fmt(n) {
  if (n == null) return '—'
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function pct(tax, gross) {
  if (!tax || !gross) return '0%'
  return (tax / gross * 100).toFixed(1) + '%'
}

// ── Shared components ──────────────────────────────────────

function BreakdownRow({ label, oldVal, newVal, highlight, isSub }) {
  return (
    <div className={`rp-table-row ${highlight ? 'rp-table-row--highlight' : ''} ${isSub ? 'rp-table-row--sub' : ''}`}>
      <div className="rp-table-cell rp-table-cell--label">{label}</div>
      <div className="rp-table-cell rp-table-cell--val rupee-display">
        {oldVal != null ? (typeof oldVal === 'number' ? fmt(oldVal) : oldVal) : '—'}
      </div>
      <div className="rp-table-cell rp-table-cell--val rp-table-cell--new rupee-display">
        {newVal != null ? (typeof newVal === 'number' ? fmt(newVal) : newVal) : '—'}
      </div>
    </div>
  )
}

function SlabTable({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return <div className="rp-slab-empty">No tax in these slabs</div>
  return (
    <div className="rp-slab-table">
      <div className="rp-slab-header">
        <div>Income Slab</div>
        <div>Rate</div>
        <div style={{ textAlign: 'right' }}>Tax</div>
      </div>
      {breakdown.map((b, i) => (
        <div key={i} className="rp-slab-row">
          <div>{fmt(b.from)} - {b.to === Infinity ? 'Above' : fmt(b.to)}</div>
          <div>{b.rate * 100}%</div>
          <div style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(b.tax)}</div>
        </div>
      ))}
    </div>
  )
}

export default function ResultsPage({ onRecalculate, onGoHome }) {
  const { state } = useAppState()
  const { computed } = state

  const [showDetails, setShowDetails] = useState(false)

  // Guard: if no data, go back
  if (!computed.estimatedGrossAnnual) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No data found.</h2>
        <button className="btn-primary" onClick={onGoHome} style={{ marginTop: '20px' }}>Go Home</button>
      </div>
    )
  }

  const { betterRegime, taxSavings } = computed
  const newTax = computed.newRegimeTotalTax
  const oldTax = computed.oldRegimeTotalTax
  const gross = computed.estimatedGrossAnnual
  const deds = computed.deductions

  // ── Plain language explainer logic ──────────────────────
  let explainerTitle = ''
  let explainerPoints = []

  if (betterRegime === 'new') {
    explainerTitle = "Why New Regime wins for you:"
    explainerPoints.push("The New Regime has lower base tax rates and a higher zero-tax limit (up to ₹12L).")
    if (computed.oldRegime80CTotal + computed.oldRegime80D + computed.oldRegimeHRAExemption < 250000) {
      explainerPoints.push("Your current investments and HRA aren't high enough to overcome the higher tax rates of the Old Regime.")
    }
    if (deds.homeLoanInterestOld > 0) {
      explainerPoints.push(`Even with your ₹${(deds.homeLoanInterestOld/100000).toFixed(1)}L home loan interest deduction, the New Regime is still mathematically cheaper.`)
    }
  } else if (betterRegime === 'old') {
    explainerTitle = "Why Old Regime wins for you:"
    explainerPoints.push("Your total deductions (HRA, 80C, etc.) push your taxable income down into lower tax brackets.")
    if (deds.hraExemption > 100000) {
      explainerPoints.push(`Your high HRA exemption (${fmt(deds.hraExemption)}) is heavily driving this result.`)
    }
    if (deds.homeLoanInterestOld > 100000) {
      explainerPoints.push("Your home loan interest deduction is a massive tax saver here.")
    }
  } else {
    explainerTitle = "It's a tie!"
    explainerPoints.push("The tax output is almost identical in both regimes.")
    explainerPoints.push("Recommendation: Choose the New Regime for simpler filing with zero proof submissions required.")
  }

  return (
    <div className="rp-root animate-fade-in">
      <div className="container rp-container">
        
        {/* Top actions */}
        <div className="rp-actions">
          <button className="rp-back-btn" onClick={onRecalculate}>
            ← Adjust Numbers
          </button>
          <div className="rp-action-right">
            <button className="rp-print-btn" onClick={() => window.print()}>
              🖨️ Print / Save PDF
            </button>
            <button className="rp-startover-btn" onClick={onGoHome}>
              Start Over
            </button>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`rp-verdict rp-verdict--${betterRegime}`}>
          <div className="rp-verdict-icon">
            {betterRegime === 'new' ? '💚' : betterRegime === 'old' ? '🟡' : '⚖️'}
          </div>
          <div className="rp-verdict-text">
            <h1 className="rp-verdict-title">
              {betterRegime === 'equal' 
                ? "Both regimes are practically equal for you."
                : `You should choose the ${betterRegime === 'new' ? 'New' : 'Old'} Regime.`}
            </h1>
            {betterRegime !== 'equal' && (
              <p className="rp-verdict-sub">
                It saves you <strong>{fmt(taxSavings)}</strong> per year.
              </p>
            )}
          </div>
        </div>

        {/* Big Comparison Cards */}
        <div className="rp-cards">
          {/* Old Regime Card */}
          <div className={`rp-card ${betterRegime === 'old' ? 'rp-card--winner' : ''}`}>
            {betterRegime === 'old' && <div className="rp-card-badge">🌟 Winner</div>}
            <h3 className="rp-card-title">Old Regime</h3>
            <div className="rp-card-tax rupee-display">{fmt(oldTax)}</div>
            <div className="rp-card-rate">{pct(oldTax, gross)} effective tax rate</div>
          </div>

          {/* New Regime Card */}
          <div className={`rp-card rp-card--new ${betterRegime === 'new' ? 'rp-card--winner rp-card--winner-new' : ''}`}>
            {betterRegime === 'new' && <div className="rp-card-badge">🌟 Winner</div>}
            <h3 className="rp-card-title">New Regime</h3>
            <div className="rp-card-tax rupee-display">{fmt(newTax)}</div>
            <div className="rp-card-rate">{pct(newTax, gross)} effective tax rate</div>
          </div>
        </div>

        {/* Explainer Box */}
        <div className="rp-explainer">
          <h4 className="rp-explainer-title">{explainerTitle}</h4>
          <ul className="rp-explainer-list">
            {explainerPoints.map((pt, i) => <li key={i}>{pt}</li>)}
          </ul>
        </div>

        {/* Toggle Detailed Breakdown */}
        <div className="rp-details-toggle">
          <button className="btn-secondary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Detailed Breakdown ▲' : 'Show Detailed Breakdown ▼'}
          </button>
        </div>

        {/* Detailed Breakdown */}
        {showDetails && (
          <div className="rp-details animate-fade-in">
            
            {/* Table Header */}
            <div className="rp-table-header">
              <div className="rp-table-cell rp-table-cell--label">Component</div>
              <div className="rp-table-cell rp-table-cell--val">Old Regime</div>
              <div className="rp-table-cell rp-table-cell--val rp-table-cell--new">New Regime</div>
            </div>

            {/* Income Section */}
            <div className="rp-table-section">Income</div>
            <BreakdownRow label="Gross Salary" oldVal={gross} newVal={gross} />
            {(deds.fdInterest > 0 || deds.rentalIncome > 0) && (
              <BreakdownRow label="Other Income (FD, Rent)" oldVal={deds.fdInterest + deds.rentalIncome} newVal={deds.fdInterest + deds.rentalIncome} />
            )}

            {/* Exemptions / Deductions */}
            <div className="rp-table-section">Deductions & Exemptions</div>
            <BreakdownRow label="Standard Deduction" oldVal={-deds.stdDeductionOld} newVal={-deds.stdDeductionNew} />
            {deds.profTax > 0 && <BreakdownRow label="Professional Tax" oldVal={-deds.profTax} newVal={-deds.profTax} />}
            {deds.employerNPS > 0 && <BreakdownRow label="Employer NPS 80CCD(2)" oldVal={-deds.employerNPS} newVal={-deds.employerNPS} />}
            
            {deds.hraExemption > 0 && <BreakdownRow label="HRA Exemption" oldVal={-deds.hraExemption} newVal={0} isSub />}
            {deds.deductions80C > 0 && <BreakdownRow label="Sec 80C (PF, LIC, etc.)" oldVal={-deds.deductions80C} newVal={0} isSub />}
            {deds.deductions80D > 0 && <BreakdownRow label="Sec 80D (Health Ins.)" oldVal={-deds.deductions80D} newVal={0} isSub />}
            {deds.homeLoanInterestOld > 0 && <BreakdownRow label="Sec 24(b) Home Loan" oldVal={-deds.homeLoanInterestOld} newVal={-deds.homeLoanInterestNew} isSub />}
            {deds.ownNPS80CDB > 0 && <BreakdownRow label="Sec 80CCD(1B) Own NPS" oldVal={-deds.ownNPS80CDB} newVal={0} isSub />}
            {deds.savingsDeduction > 0 && <BreakdownRow label="Sec 80TTA/TTB" oldVal={-deds.savingsDeduction} newVal={0} isSub />}
            {(deds.lta + deds.eduLoanInterest + deds.otherDedOld > 0) && (
              <BreakdownRow label="Other Deductions (LTA, 80E, etc)" oldVal={-(deds.lta + deds.eduLoanInterest + deds.otherDedOld)} newVal={0} isSub />
            )}

            {/* Taxable Income */}
            <BreakdownRow label="Net Taxable Income" oldVal={computed.oldRegimeTaxableIncome} newVal={computed.newRegimeTaxableIncome} highlight />

            {/* Tax Computation */}
            <div className="rp-table-section">Tax Computation</div>
            <BreakdownRow label="Tax on Slabs" oldVal={computed.oldRegimeSlabTax} newVal={computed.newRegimeSlabTax} />
            <BreakdownRow label="87A Rebate" oldVal={-computed.oldRegimeRebate} newVal={-computed.newRegimeRebate} />
            {computed.newRegimeIsMarginalRelief && (
              <BreakdownRow label="Marginal Relief" oldVal={-computed.oldRegimeMarginalRelief} newVal={-computed.newRegimeMarginalRelief} />
            )}
            <BreakdownRow label="Health & Education Cess (4%)" oldVal={computed.oldRegimeCess} newVal={computed.newRegimeCess} />
            <BreakdownRow label="Total Tax Payable" oldVal={oldTax} newVal={newTax} highlight />

            {/* Slab Details */}
            <div className="rp-slab-split">
              <div className="rp-slab-side">
                <h4>Old Regime Slabs</h4>
                <SlabTable breakdown={computed.oldSlabBreakdown} />
              </div>
              <div className="rp-slab-side rp-slab-side--new">
                <h4>New Regime Slabs</h4>
                <SlabTable breakdown={computed.newSlabBreakdown} />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
