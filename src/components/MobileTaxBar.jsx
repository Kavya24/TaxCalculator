import { useState } from 'react'
import { useAppState } from '../context/AppContext'
import './MobileTaxBar.css'

function fmt(n) {
  if (n == null) return '—'
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

export default function MobileTaxBar({ currentStep }) {
  const { state } = useAppState()
  const { computed } = state
  const [expanded, setExpanded] = useState(false)

  const newTax = computed.newRegimeTotalTax
  const oldTax = computed.oldRegimeTotalTax

  const better = newTax != null && oldTax != null
    ? (newTax <= oldTax ? 'new' : 'old')
    : null

  const savings = better
    ? Math.abs((newTax ?? 0) - (oldTax ?? 0))
    : null

  return (
    <div className="mtb-root">
      {/* Expanded drawer */}
      {expanded && (
        <div className="mtb-drawer animate-fade-in">
          <div className="mtb-drawer-grid">
            <div className="mtb-drawer-card">
              <p className="mtb-drawer-label">New Regime</p>
              <p className="mtb-drawer-tax rupee-display">{fmt(newTax)}</p>
            </div>
            <div className="mtb-drawer-card">
              <p className="mtb-drawer-label">Old Regime</p>
              <p className="mtb-drawer-tax rupee-display">{fmt(oldTax)}</p>
            </div>
          </div>
          {savings != null && savings > 0 && (
            <p className="mtb-drawer-savings">
              {better === 'new' ? '💚' : '🟡'} <strong>{better === 'new' ? 'New' : 'Old'} Regime</strong> saves {fmt(savings)}/yr
            </p>
          )}
          <p className="mtb-drawer-note">Enter your details to get your personalised result.</p>
        </div>
      )}

      {/* Sticky mini bar */}
      <button
        className="mtb-bar"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label="Toggle live tax estimate"
      >
        <div className="mtb-bar-left">
          <span className="mtb-bar-icon">📊</span>
          <span className="mtb-bar-text">
            {better
              ? `${better === 'new' ? 'New' : 'Old'} Regime saves ${fmt(savings)}`
              : 'Your estimated tax — Step ' + currentStep + ' of 8'}
          </span>
        </div>
        <div className="mtb-bar-right">
          <span className="mtb-bar-regime">New: {fmt(newTax)}</span>
          <span className="mtb-bar-expand">{expanded ? '▼' : '▲'}</span>
        </div>
      </button>
    </div>
  )
}
