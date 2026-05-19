import { useAppState } from '../context/AppContext'
import './LivePreviewPanel.css'

/* ── Rupee formatter ─────────────────────────────────────── */
function fmt(n) {
  if (n == null) return '—'
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function pct(tax, gross) {
  if (!tax || !gross) return '0%'
  return (tax / gross * 100).toFixed(1) + '%'
}

/* ── Mini slab table (shown after Step 1 data exists) ───── */
function MiniSlabRow({ label, amount, highlight, muted }) {
  return (
    <div className={[
      'lp-mini-row',
      highlight ? 'lp-mini-row--highlight' : '',
      muted     ? 'lp-mini-row--muted'     : '',
    ].join(' ')}>
      <span className="lp-mini-label">{label}</span>
      <span className="lp-mini-val rupee-display">{amount}</span>
    </div>
  )
}

/* ── Main panel ──────────────────────────────────────────── */
export default function LivePreviewPanel({ currentStep }) {
  const { state } = useAppState()
  const { computed, takeHomeSalary } = state

  const hasData = takeHomeSalary.amount != null

  const newTax = computed.newRegimeTotalTax
  const oldTax = computed.oldRegimeTotalTax
  const gross  = computed.estimatedGrossAnnual

  // Better regime
  const better = newTax != null && oldTax != null
    ? (newTax < oldTax ? 'new' : oldTax < newTax ? 'old' : 'equal')
    : null

  const savings = better && better !== 'equal'
    ? Math.abs((newTax ?? 0) - (oldTax ?? 0))
    : null

  return (
    <aside className="lpanel-root" aria-label="Live tax estimate">

      {/* Header */}
      <div className="lpanel-header">
        <span className="lpanel-header-title">Your Estimated Tax</span>
        <span className="lpanel-step-badge">Step {currentStep} of 8</span>
      </div>

      {/* Main estimate card */}
      <div className="lpanel-estimate-grid">
        {/* New Regime */}
        <div className={`lpanel-regime-card lpanel-regime-new ${better === 'new' ? 'lpanel-regime-winner' : ''}`}>
          <p className="lpanel-regime-name">New Regime</p>
          <p className="lpanel-regime-tax rupee-display">
            {newTax != null ? fmt(newTax) : '—'}
          </p>
          <p className="lpanel-regime-rate">
            {newTax != null ? pct(newTax, gross) : '0%'} effective
          </p>
          {better === 'new' && <span className="lpanel-winner-tag">🌟 Lower</span>}
        </div>

        {/* Old Regime */}
        <div className={`lpanel-regime-card lpanel-regime-old ${better === 'old' ? 'lpanel-regime-winner' : ''}`}>
          <p className="lpanel-regime-name">Old Regime</p>
          <p className="lpanel-regime-tax rupee-display">
            {oldTax != null ? fmt(oldTax) : '—'}
          </p>
          <p className="lpanel-regime-rate">
            {oldTax != null ? pct(oldTax, gross) : '0%'} effective
          </p>
          {better === 'old' && <span className="lpanel-winner-tag">🌟 Lower</span>}
        </div>
      </div>

      {/* Savings callout */}
      {savings != null && savings > 0 && (
        <div className={`lpanel-savings ${better === 'new' ? 'lpanel-savings--new' : 'lpanel-savings--old'}`}>
          <span className="lpanel-savings-icon">{better === 'new' ? '💚' : '🟡'}</span>
          <span className="lpanel-savings-text">
            <strong>{better === 'new' ? 'New' : 'Old'} Regime</strong> saves {fmt(savings)}/yr
          </span>
        </div>
      )}

      {/* Income breakdown — shown from Step 2+ */}
      {hasData && currentStep >= 2 && (
        <div className="lpanel-breakdown">
          <p className="lpanel-section-title">Income Breakdown</p>
          <MiniSlabRow label="Estimated Gross" amount={fmt(gross)} />
          <MiniSlabRow label="Standard Deduction" amount="−₹75,000 / −₹50,000" muted />

          {computed.hraExemption > 0 && (
            <MiniSlabRow label="HRA Exemption (Old)" amount={`−${fmt(computed.hraExemption)}`} />
          )}

          {computed.oldRegime80CTotal > 0 && (
            <MiniSlabRow label="80C Deductions (Old)" amount={`−${fmt(computed.oldRegime80CTotal)}`} />
          )}

          <div className="lpanel-divider" />

          {computed.newRegimeTaxableIncome != null && (
            <MiniSlabRow
              label="Taxable Income (New)"
              amount={fmt(computed.newRegimeTaxableIncome)}
              highlight
            />
          )}
          {computed.oldRegimeTaxableIncome != null && (
            <MiniSlabRow
              label="Taxable Income (Old)"
              amount={fmt(computed.oldRegimeTaxableIncome)}
              highlight
            />
          )}
        </div>
      )}

      {/* Placeholder state — no data yet */}
      {!hasData && (
        <div className="lpanel-empty">
          <div className="lpanel-empty-icon">📊</div>
          <p className="lpanel-empty-text">
            Enter your salary on the left and your live tax estimate will appear here.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="lpanel-disclaimer">
        This is an estimate. Verify with your CA before filing.
      </p>
    </aside>
  )
}
