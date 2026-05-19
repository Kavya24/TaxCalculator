import { useState } from 'react'
import './LandingPage.css'

/* ── Animated Savings Ticker ─────────────────────────────── */
function SavingsTicker() {
  return (
    <div className="lp-ticker-wrap">
      <div className="lp-ticker-card lp-ticker-old">
        <span className="lp-ticker-label">Old Regime</span>
        <span className="lp-ticker-amount rupee-display">₹68,640</span>
        <span className="lp-ticker-sub">tax paid</span>
      </div>


      <div className="lp-ticker-vs">
        <div className="lp-ticker-arrow">→</div>
        <div className="lp-ticker-save-badge">
          <span className="lp-ticker-save-icon">💰</span>
          <span className="lp-ticker-save-text">Save</span>
          <span className="lp-ticker-save-amount rupee-display">₹40,772</span>
        </div>
      </div>

      <div className="lp-ticker-card lp-ticker-new">
        <span className="lp-ticker-label">New Regime</span>
        <span className="lp-ticker-amount rupee-display">₹0</span>
        <span className="lp-ticker-sub">tax paid</span>
      </div>
    </div>
  )
}

/* ── How It Works Step Card ──────────────────────────────── */
function HowItWorksCard({ step, icon, title, desc }) {
  return (
    <div className="lp-how-card">
      <div className="lp-how-step">{step}</div>
      <div className="lp-how-icon">{icon}</div>
      <h3 className="lp-how-title">{title}</h3>
      <p className="lp-how-desc">{desc}</p>
    </div>
  )
}

/* ── Mock Result Preview ─────────────────────────────────── */
function MockResultPreview() {
  return (
    <div className="lp-mock-wrap">
      <div className="lp-mock-label">Here's what your result will look like</div>
      <div className="lp-mock-card">
        {/* Verdict banner */}
        <div className="lp-mock-verdict">
          <span className="lp-mock-verdict-icon">✅</span>
          <div>
            <p className="lp-mock-verdict-title">Pick New Regime. You save <span className="rupee-display">₹18,400</span> in taxes.</p>
            <p className="lp-mock-verdict-sub">New Regime tax: ₹0 &nbsp;|&nbsp; Old Regime tax: ₹18,400</p>
          </div>
        </div>

        {/* Side-by-side cards */}
        <div className="lp-mock-regime-row">
          <div className="lp-mock-regime lp-mock-regime-new">
            <p className="lp-mock-regime-label">New Regime 🌟</p>
            <p className="lp-mock-regime-tax rupee-display">₹0</p>
            <p className="lp-mock-regime-rate">0% effective rate</p>
          </div>
          <div className="lp-mock-regime lp-mock-regime-old">
            <p className="lp-mock-regime-label">Old Regime</p>
            <p className="lp-mock-regime-tax rupee-display">₹18,400</p>
            <p className="lp-mock-regime-rate">2.4% effective rate</p>
          </div>
        </div>

        {/* Slab table stub */}
        <div className="lp-mock-slab-wrap">
          <p className="lp-mock-slab-heading">Tax Slab Breakdown</p>
          <div className="lp-mock-slab-table">
            {[
              { range: '₹0 – ₹4,00,000', rate: '0%', tax: '₹0', active: false },
              { range: '₹4,00,001 – ₹7,20,600', rate: '5%', tax: '₹16,030', active: true },
            ].map(r => (
              <div key={r.range} className={`lp-mock-slab-row ${r.active ? 'lp-mock-slab-active' : ''}`}>
                <span>{r.range}</span>
                <span>{r.rate}</span>
                <span className="rupee-display">{r.tax}</span>
              </div>
            ))}
            <div className="lp-mock-slab-row lp-mock-slab-rebate">
              <span>Section 87A Rebate</span>
              <span></span>
              <span className="rupee-display">−₹16,030</span>
            </div>
            <div className="lp-mock-slab-row lp-mock-slab-total">
              <span>Total Tax</span>
              <span></span>
              <span className="rupee-display">₹0</span>
            </div>
          </div>
        </div>

        {/* Why section */}
        <div className="lp-mock-why">
          <p className="lp-mock-why-heading">Why New Regime wins for you:</p>
          <ul className="lp-mock-why-list">
            <li>Your income falls in the ₹12L rebate zone — zero tax under New Regime</li>
            <li>HRA exemption of ₹72,000 in Old Regime isn't enough to offset the lower rates</li>
            <li>80C deductions reduce Old Regime tax, but not to zero</li>
          </ul>
        </div>

        {/* Blur overlay */}
        <div className="lp-mock-blur" aria-hidden="true" />
      </div>
    </div>
  )
}

/* ── FAQ Item ────────────────────────────────────────────── */
function FAQItem({ q, a }) {
  return (
    <div className="lp-faq-item">
      <p className="lp-faq-q">❓ {q}</p>
      <p className="lp-faq-a">{a}</p>
    </div>
  )
}

/* ── Main Landing Page ───────────────────────────────────── */
export default function LandingPage({ onStart }) {
  const [hovering, setHovering] = useState(false)

  return (
    <div className="lp-root">

      {/* ── SECTION 1: Hero ─────────────────────────────── */}
      <section className="lp-hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="lp-hero-inner">

            {/* Left: Text */}
            <div className="lp-hero-text animate-fade-in">
              <div className="lp-hero-eyebrow">
                <span className="badge badge-primary">FY 2025-26</span>
                <span className="badge badge-success">Old Regime vs New Regime</span>
              </div>

              <h1 id="hero-heading" className="lp-hero-h1">
                Find out which tax regime{' '}
                <span className="lp-hero-h1-accent">saves you more money</span>
              </h1>

              <p className="lp-hero-sub">
                Takes 2 minutes. Works from what lands in your bank account.
                No CA needed.
              </p>

              <div className="lp-hero-cta-row">
                <button
                  id="start-calculator-btn"
                  className="btn-primary lp-hero-cta"
                  onClick={onStart}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  aria-label="Start the tax calculator"
                >
                  Start Calculator
                  <span className="lp-hero-cta-arrow" style={{ transform: hovering ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 200ms ease' }}>→</span>
                </button>
              </div>

              <p className="lp-hero-trust">
                🔒 100% private — no data leaves your browser
              </p>

              {/* Trust pills */}
              <div className="lp-hero-pills">
                <span className="lp-hero-pill">✓ No signup required</span>
                <span className="lp-hero-pill">✓ Zero server calls</span>
                <span className="lp-hero-pill">✓ Official FY 2025-26 slabs</span>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lp-hero-visual animate-fade-in" style={{ animationDelay: '150ms' }}>
              <SavingsTicker />
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: How It Works ─────────────────────── */}
      <section className="lp-how section" aria-labelledby="how-heading">
        <div className="container">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Simple &amp; Fast</p>
            <h2 id="how-heading" className="lp-section-title">How it works</h2>
            <p className="lp-section-sub">Three steps. Two minutes. One clear answer.</p>
          </div>

          <div className="lp-how-grid">
            <HowItWorksCard
              step="1"
              icon="💳"
              title="Tell us your in-hand salary"
              desc="Enter what actually lands in your bank account every month — not CTC, not gross. Just the number you see on your bank statement."
            />
            <HowItWorksCard
              step="2"
              icon="📋"
              title="Answer 7 plain-English questions"
              desc="Do you pay rent? Have a home loan? Invest in PPF or ELSS? We ask in everyday language — no tax jargon, no form numbers."
            />
            <HowItWorksCard
              step="3"
              icon="✅"
              title="See exactly which regime saves you more"
              desc="Get a clear verdict with rupee savings, a full breakdown of how the tax was calculated, and personalised tips to optimise further."
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Mock Result Preview ──────────────── */}
      <section className="lp-preview section" aria-labelledby="preview-heading">
        <div className="container">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Results Preview</p>
            <h2 id="preview-heading" className="lp-section-title">Your result will look like this</h2>
            <p className="lp-section-sub">Real numbers, real clarity — calculated just for you.</p>
          </div>

          <MockResultPreview />

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <button
              className="btn-primary lp-hero-cta"
              onClick={onStart}
              aria-label="Start the calculator to see your personalised result"
            >
              Get My Result →
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FAQ Strip ────────────────────────── */}
      <section className="lp-faq section" aria-labelledby="faq-heading">
        <div className="container">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Quick Answers</p>
            <h2 id="faq-heading" className="lp-section-title">Common questions</h2>
          </div>

          <div className="lp-faq-grid">
            <FAQItem
              q="What if I don't know my gross salary?"
              a="No problem — we'll calculate it from what you tell us. All you need is the amount that hits your bank account every month."
            />
            <FAQItem
              q="Which regime is the default in 2025-26?"
              a="The New Regime is now the default. You have to actively opt out via Form 10-IEA if the Old Regime saves you more."
            />
            <FAQItem
              q="Is this accurate?"
              a="We use the official FY 2025-26 tax slabs as per Union Budget 2025. Always verify with your CA before filing your ITR."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo">₹</div>
              <div>
                <p className="lp-footer-name">TaxClarity</p>
                <p className="lp-footer-tagline">Built for FY 2025-26 (AY 2026-27) | Last updated: April 2025</p>
              </div>
            </div>
            <p className="lp-footer-disclaimer">
              All calculations are estimates. This is not tax advice. Verify with your CA before filing.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
