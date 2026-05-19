# India Tax Regime Calculator — FY 2025-26
## Product Requirements Document (PRD) v1.0

> **Target:** Salaried individuals in India | **Scope:** Old Regime vs New Regime comparison | **Stack:** React (single-page, browser-only, no backend)

---

## Table of Contents

1. [Product Vision & Philosophy](#1-product-vision--philosophy)
2. [User Personas](#2-user-personas)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Screen-by-Screen Specification](#4-screen-by-screen-specification)
   - 4.1 Landing Page
   - 4.2 Wizard Step 1 — Take-Home Pay
   - 4.3 Wizard Step 2 — Rent & HRA
   - 4.4 Wizard Step 3 — Provident Fund (PF)
   - 4.5 Wizard Step 4 — Investments & Insurance
   - 4.6 Wizard Step 5 — Home Loan
   - 4.7 Wizard Step 6 — NPS
   - 4.8 Wizard Step 7 — Other Income & Deductions
   - 4.9 Wizard Step 8 — Age Group
   - 4.10 Results Page
5. [Live Preview Panel Specification](#5-live-preview-panel-specification)
6. [Tax Calculation Engine — Complete Specification](#6-tax-calculation-engine--complete-specification)
   - 6.1 New Regime
   - 6.2 Old Regime
   - 6.3 Age-based differences
   - 6.4 HRA Exemption Formula
   - 6.5 Section 87A Rebate & Marginal Relief
   - 6.6 Health & Education Cess
   - 6.7 Complete Calculation Walkthrough
7. [Input → Tax Field Mapping](#7-input--tax-field-mapping)
8. [Reverse Salary Engine (Take-Home → Gross)](#8-reverse-salary-engine-take-home--gross)
9. [Results Page — Full Specification](#9-results-page--full-specification)
10. [Personalized Suggestions Engine](#10-personalized-suggestions-engine)
11. [Data Validations & Edge Cases](#11-data-validations--edge-cases)
12. [UX & Design System](#12-ux--design-system)
13. [State Management Schema](#13-state-management-schema)
14. [FAQ Content per Step](#14-faq-content-per-step)
15. [Accessibility & Privacy](#15-accessibility--privacy)
16. [Tax Law Reference Summary](#16-tax-law-reference-summary)

---

## 1. Product Vision & Philosophy

### The Problem
Every year, crores of salaried Indians don't know which tax regime saves them more money. Existing calculators ask for "CTC" or "gross salary" — terms most employees don't know. They ask for "Section 80C deductions" — a phrase that means nothing to a first-year employee.

**But everyone knows one number: what lands in their bank account every month.**

### Core Principle
**Start from take-home pay. Work backwards. Ask in plain language. Show results in human terms.**

### Design Tenets
1. **One thing at a time** — One question per screen, no walls of form fields
2. **Plain language** — "How much rent do you pay?" not "Enter HRA claimed u/s 10(13A)"
3. **Real-time feedback** — Live tax estimate updates with every answer
4. **Privacy-first** — Everything runs in the browser, zero data sent to any server
5. **Trustworthy design** — Clean, minimal, no ads, no dark patterns
6. **Genuinely educational** — Explain why each input matters

---

## 2. User Personas

### Persona A — Arjun, 23, First Job
- Earns ₹45,000/month in hand
- Has no idea what CTC means
- Does standard SIP, no PPF, rents a flat
- **Needs:** "Just tell me which one is better"

### Persona B — Priya, 32, Mid-level Engineer
- Earns ₹1.1 lakh/month in hand
- Has home loan, HRA, 80C maxed
- Asks CA every year
- **Needs:** Detailed breakdown to verify her CA's advice

### Persona C — Suresh, 58, Senior Manager
- Senior citizen next year, thinking about retirement
- Has complex salary with LTA, NPS
- **Needs:** Age-aware calculations, NPS guidance

---

## 3. High-Level Architecture

```
App
├── LandingPage
│   └── HeroSection + MockResultPreview + CTA
├── WizardLayout (Steps 1–8)
│   ├── ProgressBar
│   ├── StepQuestion (left/center)
│   ├── LivePreviewPanel (right, sticky)
│   └── FAQAccordion (bottom of step)
└── ResultsPage
    ├── VerdictBanner
    ├── SideBySideComparison
    ├── SlabBreakdownTable (both regimes)
    ├── PersonalizedExplanation
    └── SuggestionsSection
```

**Tech Stack Recommendation:** React + Tailwind CSS (or equivalent utility-first CSS). No external API calls. All state in React `useState` / `useReducer`. No localStorage needed (session-only).

---

## 4. Screen-by-Screen Specification

---

### 4.1 Landing Page

**Purpose:** Convert curious visitors into calculator users. Establish trust before asking for any data.

#### Layout (Full Viewport)

**Section 1 — Hero (60–70% of viewport height)**
- **Headline (H1):** "Find out which tax regime saves you more money"
- **Subheadline:** "Takes 2 minutes. Works from what lands in your bank account. No CA needed."
- **CTA Button:** "Start Calculator →" (primary, large)
- **Trust line below CTA:** "🔒 100% private — no data leaves your browser"
- **Visual:** Illustrated split showing ₹ savings between two regimes (not a photo, a clean SVG illustration or animated number ticker)

**Section 2 — How It Works (3 steps, horizontal cards)**
- Step 1: "Tell us your in-hand salary" (icon: phone/wallet)
- Step 2: "Answer 7 plain-English questions" (icon: checklist)
- Step 3: "See exactly which regime saves you more" (icon: rupee coin / checkmark)

**Section 3 — Result Preview (Mock)**
Show a blurred/greyed-out version of what the results page looks like — with a sample person's data partially visible. Label it "Here's what your result will look like."

Elements visible in preview:
- Big green banner: "New Regime saves you ₹18,400"
- Two side-by-side cards: Old Regime Tax / New Regime Tax
- A slab table with colored rows
- A "Why this happened" section with 2–3 bullet points

**Section 4 — FAQ Strip**
3 quick questions with inline answers:
- "What if I don't know my gross salary?" → "No problem — we'll calculate it from what you tell us"
- "Which regime is default in 2025-26?" → "The New Regime is default. You have to opt out for Old Regime."
- "Is this accurate?" → "We use the official FY 2025-26 slabs. Always verify with your CA before filing."

**Footer**
- "Built for FY 2025-26 (AY 2026-27) | Last updated: April 2025"
- "All calculations are estimates. This is not tax advice."

---

### 4.2 Wizard Step 1 — Take-Home Pay

**Question:** "How much money hits your bank account every month?"

**Subtext:** "This is your in-hand salary — after PF and TDS deductions. Check your last salary credit."

**Input:**
- Large number input with ₹ prefix
- Monthly toggle (default) / Annual toggle
- Placeholder: "e.g. 65,000"
- Real-time formatting: auto-inserts commas (e.g., 65,000 / 6,50,000)

**Validation:**
- Minimum: ₹10,000/month (₹1,20,000/year) — below this, likely no tax
- Maximum: ₹5,00,000/month (for salaried scope)
- Show warning if below ₹20,833/month: "At this income, you likely pay no tax. We'll confirm at the end."

**Helper text visible on screen:**
"Not sure? Open your bank app → last month's salary credit → that's the number."

**Why this matters (shown as a small tooltip/note):**
"We use this as our starting point to work backwards to your actual taxable income."

**FAQ for this step:** (see Section 14)

---

### 4.3 Wizard Step 2 — Rent & HRA

**Question:** "Do you pay rent for the place you live in?"

**Input Type:** Yes / No radio/toggle (large tap targets)

**If YES → Follow-up questions appear:**

**Q2a:** "How much rent do you pay every month?"
- Number input, ₹ prefix
- Placeholder: e.g. 18,000

**Q2b:** "Which city do you live in?"
- Dropdown/toggle with 3 options:
  - Mumbai, Delhi, Kolkata, or Chennai (Metro)
  - Any other city (Non-Metro)
  - "Not sure / doesn't matter" → treat as Non-Metro

**Helper text:** "Metro cities get a higher HRA exemption. The 4 metros are Mumbai, Delhi, Chennai, and Kolkata."

**Q2c (optional, shown only in Old Regime path — or always asked for calculation):** "Does your company pay you HRA (House Rent Allowance) as part of your salary?"

Options:
- Yes, it's on my payslip
- No / I'm not sure

**Helper text for HRA:** "HRA is usually listed on your payslip or Form 16. It's money your employer designates specifically for rent."

**If NO (user doesn't pay rent):**
- "Got it — no HRA benefit applies. This helps the Old Regime less."

**Why this matters:**
"HRA exemption is one of the biggest tax savers in the Old Regime. It doesn't exist in the New Regime."

**FAQ for this step:** (see Section 14)

---

### 4.4 Wizard Step 3 — Provident Fund (PF)

**Question:** "Does your company deduct PF (Provident Fund) from your salary?"

**Subtext:** "Almost all companies with 20+ employees do this. Check your payslip for 'EPF deduction'."

**Options:** Yes / No / Not Sure

**If YES — Follow-up:**
"How much PF is deducted from your salary every month?"
- Number input with ₹ prefix
- Helper: "Usually 12% of your basic salary. Check your payslip."
- Also show: "Your company contributes the same amount separately — that doesn't come from your salary."

**If Not Sure:**
- "We'll assume a standard 12% of your estimated basic salary. You can always adjust."
- Calculator assumes a PF deduction based on estimated basic (see Section 8).

**Why this matters:**
"Your own PF contribution counts under Section 80C (max ₹1.5 lakh/year benefit in Old Regime). The employer's contribution is separate and tax-free regardless of regime."

**FAQ for this step:** (see Section 14)

---

### 4.5 Wizard Step 4 — Investments & Insurance

**Question:** "Do you have any of these? Select all that apply."

**Multi-select cards (tap to toggle, visual checkmark):**

| Card | Plain Label | Examples shown |
|------|-------------|----------------|
| 80C Investments | "Tax-saving investments (80C)" | PPF, ELSS mutual funds, LIC premium, NSC, 5-yr FD, children's tuition fees |
| Health Insurance | "Health insurance (mediclaim)" | Your policy + family. Company-paid doesn't count here. |
| Education Loan | "Education loan interest" | Loan for your own or child's higher education |
| Savings / FD Interest | "Interest from savings or FDs" | Interest earned from bank accounts or fixed deposits |

**If "Tax-saving investments (80C)" selected:**
"How much do you invest/pay in these per year?"
- Slider + number input
- Range: ₹0 to ₹1,50,000
- Pre-filled with PF amount if entered in Step 3 (with note: "We've already counted your PF contribution here")
- Max clamp: ₹1,50,000 (Section 80C limit — show user if they try to enter more)
- Helper: "Add up your PPF deposits, ELSS SIP total for the year, LIC premiums, kids' tuition, and 5-year FDs."

**If "Health Insurance" selected:**
"How much do you pay in health insurance premiums per year?"

Show sub-options:
- "For myself (and spouse/kids)" — slider up to ₹25,000
- "Also for my parents" — additional input up to ₹25,000 (or ₹50,000 if parents are senior citizens)

Checkbox: "My parents are senior citizens (60+)" → changes limit to ₹50,000

**If "Education Loan Interest" selected:**
"How much interest did you pay on your education loan this year?"
- Number input, no upper limit

**If "Savings / FD Interest" selected:**
"How much interest did you earn from savings accounts and FDs this year?"
- Note: "Interest up to ₹10,000/year from savings accounts is deductible (₹50,000 for senior citizens). FD interest is fully taxable and added to your income."
- Two sub-fields:
  - Savings account interest (₹, max deductible = ₹10,000 under 80TTA)
  - FD interest (₹, fully taxable, added to income)

**Why this matters:**
"These deductions only reduce your tax in the Old Regime. In the New Regime, they don't exist — but the New Regime has lower tax rates instead."

---

### 4.6 Wizard Step 5 — Home Loan

**Question:** "Do you have a home loan?"

**Options:** Yes / No

**If YES:**

**Q5a:** "Is the property you're paying the loan for..."
- Self-occupied (you or your family live there)
- Rented out (tenants pay you rent)

**Q5b:** "How much home loan interest did you pay this year?"
- Number input with ₹ prefix
- If self-occupied: show note "Only up to ₹2,00,000 of this counts in the Old Regime for self-occupied property"
- If rented: "If you rent this out, the full interest is deductible against rental income in both regimes"

**Q5c (if rented):** "How much rental income did you receive this year?"
- Number input

**Q5d:** "How much home loan principal did you repay this year? (Optional)"
- Number input
- Helper: "The principal repayment counts towards your ₹1.5 lakh 80C limit."
- Note: "This is optional — we can estimate if you skip it."

**Why this matters:**
"Home loan interest on a self-occupied property gives up to ₹2 lakh deduction annually in the Old Regime. This doesn't apply in the New Regime."

---

### 4.7 Wizard Step 6 — NPS

**Question:** "Do you or your employer invest in NPS (National Pension System)?"

**Subtext:** "NPS is a government retirement scheme. Many companies offer it. Check your payslip or offer letter."

**Show three sub-options:**

**Q6a:** "Do you personally invest in NPS (Tier I)?"
- Yes / No
- If Yes: "How much per year?" → number input → note: "Over ₹1.5L already in 80C? You can get an extra ₹50,000 deduction here under 80CCD(1B)."

**Q6b:** "Does your company contribute to your NPS?"
- Yes / No / Not sure
- If Yes: "How much does your company contribute per year?" → number input (or "I don't know" option)
- Note: "This is the most powerful NPS benefit — employer NPS contribution up to 14% of salary is deductible in BOTH regimes."

**Why this matters:**
"Employee NPS contribution only helps in the Old Regime. Employer NPS contribution helps in both regimes — it's the one deduction that works even if you pick New Regime."

---

### 4.8 Wizard Step 7 — Other Income & Deductions

**Question:** "Almost done! A couple more quick things."

Show compact cards for remaining inputs:

**Professional Tax:**
- "Does your company deduct professional tax from your salary?"
- Options: Yes (₹200/month = ₹2,400/year, pre-filled) / No / Not sure
- Note: "Most states charge ₹200/month. Check your payslip."

**Standard Deduction:**
- Not a question — just a note: "We automatically apply the standard deduction (₹75,000 in New Regime, ₹50,000 in Old Regime) — no action needed from you."

**LTA (Leave Travel Allowance):**
- "Does your company provide LTA as part of your salary?"
- Yes / No
- If Yes: "How much LTA do you receive per year?" → number input
- Note: "LTA is tax-free only for actual travel within India, for 2 journeys in a 4-year block. We'll assume you claim it fully." (For simplicity, treat claimed LTA as exempt in Old Regime.)

**Other deductions (optional catch-all):**
- "Any other tax-saving amounts I haven't asked about?" (text hint: "e.g. disability deduction, donations u/s 80G")
- Number input, labeled "Other deductions (Old Regime only)"

---

### 4.9 Wizard Step 8 — Age Group

**Question:** "How old are you?"

**Three large option cards:**
- Under 60 years old
- Between 60 and 80 (Senior Citizen)
- Above 80 (Super Senior Citizen)

**Helper text:**
"Your age affects the tax-free income limit in the Old Regime. Senior citizens get a higher basic exemption."

**Sub-note:**
"Senior citizen status (60+) is checked as of 31 March 2026 for FY 2025-26."

---

## 5. Live Preview Panel Specification

The live preview panel is visible at all times during the wizard on desktop (right side, ~35% width, sticky). On mobile, it appears as a collapsible drawer pinned to the bottom.

### What to Show

**At all times:**
- Progress: "Step X of 8"
- Current inputs summary (compact list of what's been entered so far)
- "Calculating..." spinner or instant update

**Running Tax Estimate (updates with every input):**

Show a compact comparison card:

```
┌─────────────────────────────────────┐
│  YOUR ESTIMATED TAX                 │
│                                     │
│  New Regime       Old Regime        │
│  ₹0               ₹28,600          │
│  (effective: 0%)  (effective: 3.2%) │
│                                     │
│  💚 New Regime saves ₹28,600        │
│                                     │
│  [inputs assumed so far...]         │
└─────────────────────────────────────┘
```

**Detailed Live Panel (expanded view, shown after Step 2+):**

Income Breakdown:
- Estimated Gross Salary: ₹X
- Standard Deduction: -₹75,000 / -₹50,000
- HRA Exemption (Old): -₹X
- 80C Deductions (Old): -₹X
- Taxable Income: ₹X

Tax Slabs Applied:
Small mini-table showing each slab and the tax on it (updates live)

Both Regime Summary:
Two columns side-by-side

**Note at bottom of panel (always visible):**
"This is an estimate. Verify with your CA before filing."

---

## 6. Tax Calculation Engine — Complete Specification

### 6.1 New Regime — FY 2025-26 (AY 2026-27)

**Tax Slabs (same for ALL age groups):**

| Taxable Income Slab | Rate |
|---------------------|------|
| Up to ₹4,00,000 | NIL |
| ₹4,00,001 – ₹8,00,000 | 5% |
| ₹8,00,001 – ₹12,00,000 | 10% |
| ₹12,00,001 – ₹16,00,000 | 15% |
| ₹16,00,001 – ₹20,00,000 | 20% |
| ₹20,00,001 – ₹24,00,000 | 25% |
| Above ₹24,00,000 | 30% |

**Deductions Allowed in New Regime (for salaried):**
- Standard Deduction: ₹75,000 (mandatory, applied automatically)
- Employer's NPS contribution: Section 80CCD(2) — up to 14% of (Basic + DA) for government employees, 10% for others (NOTE: for this calculator, apply 10% of estimated basic/gross)
- Professional Tax: deductible (u/s 16)
- Interest on home loan for let-out property: deductible against rental income (u/s 24b), no cap

**Deductions NOT Allowed in New Regime:**
- HRA (Section 10(13A))
- LTA (Section 10(5))
- Section 80C (EPF, PPF, ELSS, LIC, tuition, etc.)
- Section 80D (health insurance premium)
- Section 80CCD(1) and 80CCD(1B) (own NPS contributions)
- Section 24(b) for self-occupied property home loan interest
- Section 80TTA / 80TTB (savings interest)
- Section 80E (education loan interest)

**Rebate under Section 87A (New Regime):**
- If net taxable income ≤ ₹12,00,000: Full rebate up to ₹60,000 (tax = 0)
- If net taxable income > ₹12,00,000: No rebate
- Marginal relief: If income is between ₹12,00,001 and approximately ₹12,75,000: Tax payable = min(calculated tax, income − ₹12,00,000)

**Effective tax-free limit for salaried:**
- Gross salary up to ₹12,75,000 → taxable income after standard deduction = ₹12,00,000 → zero tax

---

### 6.2 Old Regime — FY 2025-26 (AY 2026-27)

**Tax Slabs — Below 60 years:**

| Taxable Income Slab | Rate |
|---------------------|------|
| Up to ₹2,50,000 | NIL |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Tax Slabs — Senior Citizen (60 to 79 years):**

| Taxable Income Slab | Rate |
|---------------------|------|
| Up to ₹3,00,000 | NIL |
| ₹3,00,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Tax Slabs — Super Senior Citizen (80+ years):**

| Taxable Income Slab | Rate |
|---------------------|------|
| Up to ₹5,00,000 | NIL |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Standard Deduction (Old Regime):** ₹50,000

**Key Deductions (Old Regime):**

| Section | Description | Max Deduction |
|---------|-------------|---------------|
| 16(ia) | Standard Deduction | ₹50,000 |
| 16(iii) | Professional Tax | Actual (max ₹2,400/yr) |
| 10(13A) | HRA Exemption | Formula-based (see 6.4) |
| 80C | PF, PPF, ELSS, LIC, NSC, tuition, 5-yr FD, home loan principal | ₹1,50,000 |
| 80CCC | Pension fund contribution | Included in ₹1.5L 80C limit |
| 80CCD(1) | Own NPS contribution | Included in ₹1.5L 80C limit |
| 80CCD(1B) | Extra NPS contribution | ₹50,000 additional (over 80C) |
| 80CCD(2) | Employer NPS contribution | Up to 10% of salary (14% for govt) |
| 80D | Health insurance premium (self/family) | ₹25,000 (₹50,000 if 60+) |
| 80D | Health insurance premium (parents) | ₹25,000 (₹50,000 if parents 60+) |
| 24(b) | Home loan interest (self-occupied) | ₹2,00,000 |
| 80E | Education loan interest | No upper limit (for 8 years) |
| 80TTA | Savings account interest | ₹10,000 |
| 80TTB | Savings/FD interest for senior citizens (60+) | ₹50,000 |
| 10(5) | LTA (Leave Travel Allowance) | Actual travel cost (2 trips / 4 yrs) |

**Rebate under Section 87A (Old Regime):**
- If net taxable income ≤ ₹5,00,000: Rebate up to ₹12,500
- Marginal relief applies near the ₹5L threshold

---

### 6.3 Age-Based Differences Summary

| Feature | < 60 | 60–79 (Senior) | 80+ (Super Senior) |
|---------|------|----------------|---------------------|
| **New Regime Basic Exemption** | ₹4L | ₹4L | ₹4L |
| **Old Regime Basic Exemption** | ₹2.5L | ₹3L | ₹5L |
| **Old Regime 87A Rebate** | Eligible (≤₹5L) | Eligible (≤₹5L) | Not eligible |
| **New Regime 87A Rebate** | Eligible (≤₹12L) | Eligible (≤₹12L) | Not eligible |
| **80D (self/family)** | ₹25,000 | ₹50,000 | ₹50,000 |
| **80TTA / 80TTB** | 80TTA: ₹10,000 | 80TTB: ₹50,000 | 80TTB: ₹50,000 |

---

### 6.4 HRA Exemption Formula (Old Regime Only)

The HRA exemption is the **minimum** of the following three:

1. **Actual HRA received from employer** (from payslip)
2. **Actual rent paid minus 10% of Basic Salary**
   `= Rent paid − (10% × Basic Salary)`
3. **50% of Basic Salary** (if metro city: Mumbai, Delhi, Chennai, Kolkata)
   **OR 40% of Basic Salary** (if non-metro)

**"Salary" for HRA purposes = Basic Salary + Dearness Allowance (DA)**
For private sector employees, DA is usually 0, so Salary = Basic.

**HRA Exemption = min(HRA received, Rent − 10% of Basic, 40%/50% of Basic)**
The exempt portion is tax-free. The balance is taxable.

**Important rules:**
- If rent paid < 10% of basic, HRA exemption = 0 (all HRA is taxable)
- If the employee doesn't receive HRA, they can claim 80GG instead (not covered in this calculator's scope for salaried with HRA)
- Rent receipts required if monthly rent > ₹8,333/month. PAN of landlord required if annual rent > ₹1,00,000

**How to handle in this calculator (when we don't know the exact HRA amount):**
If user says "Yes, my company pays HRA" but doesn't know the amount:
- Estimate HRA = 50% of estimated basic salary (common industry norm)
- Note: "We've estimated your HRA based on typical salary structures. Actual exemption may vary."

---

### 6.5 Section 87A Rebate & Marginal Relief — Full Calculation

#### New Regime

```
if (taxableIncome <= 1200000):
    rebate = min(taxBeforeCess, 60000)
    taxAfterRebate = taxBeforeCess - rebate   // = 0 in most cases
    
elif (taxableIncome > 1200000 AND taxableIncome < 1275000):
    // Marginal relief zone
    normalTax = calculateSlabTax(taxableIncome)
    excessIncome = taxableIncome - 1200000
    taxWithCess = normalTax * 1.04
    if (taxWithCess > excessIncome):
        // Apply marginal relief
        taxPayable = excessIncome  // user pays only the excess income above 12L
    else:
        taxPayable = normalTax + cess
        
else:
    // taxableIncome >= 1275000
    taxPayable = normalTax + cess  // normal slabs, no rebate
```

#### Old Regime

```
if (taxableIncome <= 500000):
    rebate = min(taxBeforeCess, 12500)
    taxAfterRebate = taxBeforeCess - rebate
    
// Marginal relief near 5L threshold:
elif (taxableIncome slightly > 500000):
    normalTax = calculateSlabTax(taxableIncome)
    excessIncome = taxableIncome - 500000
    if (normalTax > excessIncome):
        taxPayable = excessIncome
    else:
        taxPayable = normalTax + cess
        
else:
    taxPayable = normalTax + cess
```

**Note on Super Senior Citizens (80+):** Not eligible for 87A rebate. Full slab tax applies regardless.

---

### 6.6 Health & Education Cess

- **Rate:** 4% on (income tax + surcharge)
- Applied to ALL taxpayers in BOTH regimes
- Surcharge is NOT calculated in this app (applies only to income > ₹50 lakh — outside salaried scope)

```
finalTax = (taxAfterRebate) * 1.04  // + 4% cess
```

---

### 6.7 Complete Calculation Walkthrough

**Example: Arjun, 26 years, Take-home ₹65,000/month**

**Step 1 — Reverse Engineer Gross Salary:**
(See Section 8 for full algorithm)
- Take-home: ₹65,000/month = ₹7,80,000/year
- PF deduction (assume 12% of basic): ~₹6,240/month
- TDS estimate (first pass, assume 0 for now)
- Estimated gross: ₹71,240/month = ~₹8,55,000/year
- After iterative TDS reconciliation: Gross ≈ ₹8,70,000/year

**Step 2 — Salary Structure Estimation:**
- Basic = 40–50% of gross (use 40% for calculation) = ₹3,48,000/year
- HRA = 50% of basic = ₹1,74,000/year (if city is non-metro, 40%)
- Special allowances = remaining

**Step 3 — New Regime Calculation:**
- Gross Salary: ₹8,70,000
- Less: Standard Deduction: ₹75,000
- Less: Professional Tax: ₹2,400
- Less: Employer NPS (if any): ₹0
- **Taxable Income: ₹7,92,600**

Tax calculation:
- ₹0 – ₹4,00,000: ₹0
- ₹4,00,001 – ₹7,92,600 (₹3,92,600 @ 5%): ₹19,630
- **Tax before rebate: ₹19,630**
- Since taxable income (₹7,92,600) < ₹12,00,000 → 87A rebate = ₹19,630
- **Tax after rebate: ₹0**
- Cess: ₹0
- **Total Tax (New Regime): ₹0**

**Step 4 — Old Regime Calculation:**
Assume: PF ₹6,240/month, 80C = ₹74,880 (PF only), 80D = ₹0, Rents ₹12,000/month in Bengaluru, HRA received ₹14,500/month

- Gross Salary: ₹8,70,000
- Less: Standard Deduction: ₹50,000
- Less: Professional Tax: ₹2,400
- Less: HRA Exemption:
  - Actual HRA: ₹1,74,000
  - Rent − 10% Basic: ₹1,44,000 − ₹34,800 = ₹1,09,200
  - 40% of Basic: ₹1,39,200
  - HRA Exemption = min(₹1,74,000, ₹1,09,200, ₹1,39,200) = ₹1,09,200
- Less: 80C: ₹74,880
- Less: 80D: ₹0
- Gross Taxable: ₹8,70,000 − ₹50,000 − ₹2,400 − ₹1,09,200 − ₹74,880 = **₹6,33,520**

Tax calculation (below 60):
- ₹0 – ₹2,50,000: ₹0
- ₹2,50,001 – ₹5,00,000 (₹2,50,000 @ 5%): ₹12,500
- ₹5,00,001 – ₹6,33,520 (₹1,33,520 @ 20%): ₹26,704
- **Tax before rebate: ₹39,204**
- Taxable income > ₹5,00,000 → No 87A rebate
- Cess: ₹39,204 × 4% = ₹1,568
- **Total Tax (Old Regime): ₹40,772**

**Verdict: New Regime saves ₹40,772**

---

## 7. Input → Tax Field Mapping

| User Input (Plain Language) | Tax Field | Which Regime |
|------------------------------|-----------|--------------|
| Take-home salary | Gross salary (via reverse engine) | Both |
| City (metro/non-metro) | HRA % for exemption calc | Old only |
| Monthly rent | HRA exemption (part of formula) | Old only |
| PF deduction/month × 12 | Section 80C deduction (part of ₹1.5L) | Old only |
| 80C investments per year | Section 80C (total with PF, capped ₹1.5L) | Old only |
| Health insurance premium (self) | Section 80D (up to ₹25K or ₹50K if 60+) | Old only |
| Health insurance premium (parents) | Section 80D (additional ₹25K/₹50K) | Old only |
| Parents senior citizen flag | 80D parent limit toggle | Old only |
| Home loan interest (self-occupied) | Section 24(b), max ₹2,00,000 | Old only |
| Home loan interest (let-out) | Section 24(b) against rental income | Both |
| Rental income received | Income from House Property | Both |
| Home loan principal | Included in 80C (within ₹1.5L cap) | Old only |
| Own NPS contribution | 80CCD(1) (within 80C cap) + 80CCD(1B) | Old only |
| Employer NPS contribution | 80CCD(2) up to 10% of salary | Both |
| Education loan interest | Section 80E (no cap) | Old only |
| Savings account interest | 80TTA (₹10K) or 80TTB (₹50K senior) | Old only |
| FD interest received | Added to gross taxable income | Both |
| Professional tax paid | Section 16(iii) | Both |
| LTA received and claimed | Exempt under Section 10(5) | Old only |
| Other deductions | Free-form deduction input | Old only |
| Age group | Basic exemption limit, 80D limits | Old (different slabs); New (rebate eligibility) |

---

## 8. Reverse Salary Engine (Take-Home → Gross)

Since users enter their take-home (in-hand) salary, we must reverse-engineer the gross salary. The algorithm is iterative.

### What's Deducted from Gross to Get Take-Home:
1. Employee PF contribution (usually 12% of Basic, capped at 12% of ₹15,000 = ₹1,800/month for statutory limit, but many companies deduct on full basic)
2. TDS (income tax deducted at source monthly)
3. Professional Tax (₹200/month in most states)
4. Any other deductions (food coupons recovery, etc.) — ignored for simplicity

**Take-Home = Gross − PF_employee − TDS − Professional_Tax**

### Algorithm

```javascript
function reverseEngineGross(takeHomePM, pfDeductionPM, profTax = 200) {
  // pfDeductionPM: user-entered PF deduction per month (or estimated)
  
  // First estimate: assume 0 TDS to get approximate gross
  let estimatedGross = takeHomePM + pfDeductionPM + profTax;
  
  // Iterate to find gross with TDS reconciliation
  for (let i = 0; i < 10; i++) {
    let grossPA = estimatedGross * 12;
    
    // Estimate TDS based on current gross (simplified):
    let newTaxPA = calculateNewRegimeTax(grossPA); // simplest first pass
    let tdsPerMonth = newTaxPA / 12;
    
    let newGross = takeHomePM + pfDeductionPM + profTax + tdsPerMonth;
    
    if (Math.abs(newGross - estimatedGross) < 100) break;
    estimatedGross = newGross;
  }
  
  return estimatedGross * 12; // annual gross
}
```

### Salary Structure Estimation
From estimated gross annual salary, estimate salary components:

| Component | Estimate |
|-----------|---------|
| Basic | 40% of gross (private sector) |
| HRA | 50% of Basic if metro, 40% if non-metro |
| Special Allowance | Gross − Basic − HRA − LTA − other allowances |
| LTA | As entered by user (or 0) |

**If PF was entered by user:**
- Validate: PF should be approximately 12% of Basic
- If wildly off, use 12% of Basic as canonical value and note the discrepancy

---

## 9. Results Page — Full Specification

### Section 1 — Verdict Banner

Full-width colored banner (not a small card):

**If New Regime is better:**
```
✅  Pick New Regime. You save ₹[X] in taxes.
    Your New Regime tax: ₹[A]  |  Old Regime tax: ₹[B]
```

**If Old Regime is better:**
```
✅  Pick Old Regime. You save ₹[X] in taxes.
    Your Old Regime tax: ₹[A]  |  New Regime tax: ₹[B]
```

**If both are equal (within ₹500):**
```
⚖️  Both regimes give you nearly the same tax.
    Difference is less than ₹500 — pick whichever is simpler for you.
    Simpler choice: New Regime (no paperwork needed).
```

**If income is too low to pay tax in either:**
```
🎉  Great news! You pay zero tax in both regimes.
    Your taxable income is below the tax-free limit.
```

Sub-line in all cases: "New Regime is the default. If Old Regime saves you more, you need to file Form 10-IEA with your employer and when filing ITR."

---

### Section 2 — Side-by-Side Comparison Table

```
┌──────────────────────────────┬────────────────────┬────────────────────┐
│                              │   NEW REGIME 🌟    │    OLD REGIME      │
├──────────────────────────────┼────────────────────┼────────────────────┤
│ Gross Salary                 │ ₹8,70,000          │ ₹8,70,000          │
│ Standard Deduction           │ -₹75,000           │ -₹50,000           │
│ Professional Tax             │ -₹2,400            │ -₹2,400            │
│ HRA Exemption                │ ✗ Not applicable   │ -₹1,09,200         │
│ 80C Deductions               │ ✗ Not applicable   │ -₹74,880           │
│ 80D (Health Insurance)       │ ✗ Not applicable   │ -₹0                │
│ Home Loan Interest           │ ✗ Not applicable   │ -₹0                │
│ NPS (Own Contribution)       │ ✗ Not applicable   │ -₹0                │
│ Employer NPS                 │ -₹0                │ -₹0                │
│ Net Taxable Income           │ ₹7,92,600          │ ₹6,33,520          │
├──────────────────────────────┼────────────────────┼────────────────────┤
│ Tax on Slabs                 │ ₹19,630            │ ₹39,204            │
│ Section 87A Rebate           │ -₹19,630           │ -₹0                │
│ Tax After Rebate             │ ₹0                 │ ₹39,204            │
│ Health & Education Cess (4%) │ ₹0                 │ ₹1,568             │
│ TOTAL TAX                    │ ₹0                 │ ₹40,772            │
│ Monthly Tax                  │ ₹0/month           │ ₹3,398/month       │
│ Effective Tax Rate           │ 0%                 │ 4.7%               │
└──────────────────────────────┴────────────────────┴────────────────────┘
```

Items with ✗ are grayed out visually. Items not applicable are shown with a strikethrough or a muted "N/A".

---

### Section 3 — Slab-by-Slab Breakdown

Show for BOTH regimes in two stacked tables or tabs:

**New Regime Slabs:**

| Income Range | Rate | Tax on This Slab |
|-------------|------|-----------------|
| ₹0 – ₹4,00,000 | 0% | ₹0 |
| ₹4,00,001 – ₹7,92,600 | 5% | ₹19,630 |
| Sub-total | | ₹19,630 |
| Section 87A Rebate | | -₹19,630 |
| **Total (before cess)** | | **₹0** |
| Cess @4% | | ₹0 |
| **Total Tax Payable** | | **₹0** |

**Old Regime Slabs:**

| Income Range | Rate | Tax on This Slab |
|-------------|------|-----------------|
| ₹0 – ₹2,50,000 | 0% | ₹0 |
| ₹2,50,001 – ₹5,00,000 | 5% | ₹12,500 |
| ₹5,00,001 – ₹6,33,520 | 20% | ₹26,704 |
| **Sub-total** | | **₹39,204** |
| Section 87A Rebate | | ₹0 (not eligible) |
| Cess @4% | | ₹1,568 |
| **Total Tax Payable** | | **₹40,772** |

---

### Section 4 — Personalized "Why This Happened" Explanation

This is auto-generated in plain English based on the user's inputs.

**Template (fill in actual values):**

> **Here's why [winning regime] works better for you:**
>
> - Your HRA exemption of **₹1,09,200** saves you **₹21,840** in the Old Regime — but the New Regime's lower rates cancel this out.
> - Your Section 80C investments of **₹74,880** reduce your Old Regime tax by ₹14,976.
> - Despite these deductions, your income falls in the 87A rebate zone under the New Regime, wiping out all tax.
> - **Bottom line:** The 87A rebate (no tax up to ₹12 lakh) beats your Old Regime deductions at your income level.

**Generate one bullet per significant input.** Each bullet should:
1. Name the input in plain language
2. State the tax saving it provides in the Old Regime (₹)
3. Note whether that saving is bigger or smaller than the New Regime's advantage

---

## 10. Personalized Suggestions Engine

**These appear only in the Old Regime section, and only when relevant:**

### Suggestion Logic:

**S1 — 80C not maxed (Old Regime scenario):**
- Condition: `deductions_80C < 150000`
- Message: "You're leaving **₹[150000 - current80C]** of 80C on the table. Investing this additional amount in PPF or ELSS would save you **₹[amount × tax_rate]** more in tax."

**S2 — 80D not used:**
- Condition: `health_insurance_premium == 0`
- Message: "You haven't mentioned health insurance. A ₹25,000 annual premium could save you **₹5,000 in tax** and also protects your savings. Consider it a tax-efficient expense."

**S3 — NPS 80CCD(1B) not used (Old Regime):**
- Condition: `nps_own_contribution < 50000 AND old_regime_chosen`
- Message: "You can save an additional **₹50,000 deduction** by contributing to NPS under 80CCD(1B). This is over and above your 80C limit. Tax saving: **₹[50000 × marginal_rate]**."

**S4 — Employer NPS not maximized:**
- Condition: `employer_nps == 0 OR employer_nps_small`
- Message: "If your employer can restructure to contribute **₹[X]** to your NPS account, that amount is tax-free in BOTH regimes under 80CCD(2). Ask your HR if this is possible."

**S5 — Close to 87A rebate threshold (New Regime):**
- Condition: `new_regime_taxable > 1150000 AND new_regime_taxable <= 1300000`
- Message: "Your taxable income under the New Regime is **₹[X] above the ₹12 lakh zero-tax threshold**. If you can contribute **₹[X]** more to Employer NPS or use 80CCD(2), you could bring your tax down to zero."

**S6 — Only 1 regime saves marginally:**
- Condition: `savings < 5000`
- Message: "The difference between the two regimes is only ₹[X] for you. Consider going with the New Regime anyway — it's simpler, needs no paperwork or investment proofs."

**S7 — High income, large deductions, Old Regime is still better:**
- Condition: `old_regime_tax < new_regime_tax AND gross > 1500000`
- Message: "Your high deductions (especially HRA + 80C + home loan) make the Old Regime worthwhile. Make sure you're maximizing: 80C (₹1.5L), 80CCD(1B) NPS (₹50K extra), and 80D."

---

## 11. Data Validations & Edge Cases

### Input Validations

| Field | Rule | Error Message |
|-------|------|---------------|
| Take-home salary | > ₹0 | "Please enter a valid amount" |
| Take-home salary | ≤ ₹60,00,000/year | "This calculator covers standard salaried income. For very high incomes, consult a CA." |
| Monthly rent | ≤ take-home salary | "Your rent seems higher than your take-home. Please check." |
| 80C total | Auto-cap at ₹1,50,000 | Show: "80C limit is ₹1.5 lakh. We've capped it." |
| 80D (self, < 60) | Auto-cap at ₹25,000 | Show: "80D limit for under 60 is ₹25,000" |
| 80D (self, 60+) | Auto-cap at ₹50,000 | Show: "80D limit for senior citizens is ₹50,000" |
| Home loan interest (self-occ) | Auto-cap at ₹2,00,000 in Old Regime | Show: "Deduction is capped at ₹2 lakh for self-occupied property" |
| HRA > gross/12 | Flag as unusual | "Your HRA seems higher than your monthly salary. Please verify." |
| PF > 20,000/month | Flag as high | "Your PF deduction is unusually high. Did you mean ₹[X]/year?" |
| Employer NPS | Warn if > 14% of estimated basic | "Employer NPS contribution exceeds the 14% limit. We'll cap at 14%." |

### Edge Cases

**EC1 — Zero tax scenario:**
- Both regimes = ₹0 tax
- Message: "You pay no tax in either regime. You're below the tax-free threshold."
- Still show the slab table with everything as ₹0 to educate.

**EC2 — Marginal relief at ₹12 lakh (New Regime):**
- Taxable income: ₹12,05,000
- Without marginal relief: Tax = ₹61,500 + ₹2,460 cess = ₹63,960
- With marginal relief: Tax = min(₹63,960, ₹5,000) = ₹5,000
- Show clearly: "Marginal relief applied. You only pay tax on ₹5,000 (the income above ₹12 lakh)."

**EC3 — Old Regime 87A at ₹5 lakh:**
- Income ₹5,05,000 Old Regime
- Excess: ₹5,000 above ₹5L
- Normal tax: ₹12,750 → marginal relief → tax = min(₹12,750, ₹5,000) = ₹5,000

**EC4 — HRA equals rent (exemption capped):**
- If rent − 10% of basic < 0, HRA exemption = 0
- Show: "Your rent is less than 10% of your basic salary, so no HRA benefit applies."

**EC5 — Super senior citizen (80+) and 87A:**
- No 87A rebate applicable
- Show explicitly in results: "As a super senior citizen (80+), Section 87A rebate is not available. However, your basic exemption in the Old Regime is ₹5 lakh."

**EC6 — PF entered, but 80C already at ₹1.5L from other investments:**
- PF is included in the 80C bucket
- Total 80C = min(PF + other_investments, 150000)
- Note in results: "Your 80C limit of ₹1.5L is already maxed. Additional PF doesn't add more deduction."

**EC7 — Employer NPS entered for New Regime:**
- 80CCD(2) is allowed in New Regime
- Deduct from gross before calculating taxable income in New Regime
- Show in New Regime deductions table

**EC8 — Let-out property home loan:**
- Rental income added to gross total income
- Interest deducted against rental income (no cap in Old Regime; in New Regime, set-off limited to that year's rental income, no carry forward)
- Net house property income = Rental income − 30% standard deduction − full interest paid

**EC9 — FD interest entered:**
- Added to gross taxable income in BOTH regimes
- Increases taxable income (not a deduction)
- Shown in results: "Your FD interest of ₹[X] increases your taxable income."

**EC10 — Near-zero difference:**
- If |Old tax − New tax| < ₹500
- Recommend New Regime (simpler, default)
- Show: "Pick New Regime — same tax, less paperwork."

---

## 12. UX & Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1A56DB` | CTA buttons, progress, active states |
| `--primary-light` | `#EBF5FF` | Selected card backgrounds |
| `--success` | `#057A55` | New regime winner banner, savings amount |
| `--success-light` | `#DEF7EC` | Winner card background |
| `--warning` | `#C27803` | Old regime winner, caution notes |
| `--warning-light` | `#FDF6B2` | Old regime card background |
| `--neutral-900` | `#111827` | Primary text |
| `--neutral-500` | `#6B7280` | Secondary text, helpers |
| `--neutral-100` | `#F3F4F6` | Step background, inactive cards |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--border` | `#E5E7EB` | Card borders, dividers |

### Typography

- **H1 (Landing):** 40–48px, weight 700, tight tracking
- **H2 (Section heads):** 28–32px, weight 600
- **Step question:** 24–28px, weight 600, centered
- **Body:** 16px, weight 400, line-height 1.6
- **Helper text:** 14px, weight 400, `--neutral-500`
- **Numbers in preview:** 28–36px, weight 700, monospaced
- **Font stack:** `-apple-system, 'Inter', sans-serif`

### Layout — Wizard

Desktop (≥ 1024px):
```
┌──────────────────────────────────────────────────────┐
│ Progress Bar (top, full width)                       │
├──────────────────────────┬───────────────────────────┤
│                          │                           │
│  Step Content (65%)      │  Live Preview (35%)       │
│                          │  [sticky, scrolls with]   │
│  Question                │                           │
│  Input(s)                │  Tax Estimate Card        │
│  Next Button             │  Income Breakdown         │
│  FAQ Accordion           │  Slab Mini-Table          │
│                          │                           │
└──────────────────────────┴───────────────────────────┘
```

Mobile (< 1024px):
- Full-width step content
- Sticky "Tax so far" mini-bar at bottom (tappable to expand full preview)
- FAQ accordion below each question

### Interaction Patterns

**Large Option Cards (Yes/No, Metro/Non-Metro):**
- Tap anywhere on card to select
- Selected state: primary border + light background + checkmark icon
- Clear unselected state: neutral border, white background
- No radio buttons visible (card IS the control)

**Number Inputs:**
- Large input field (48px height minimum)
- ₹ prefix visible inside field
- Auto-format with commas on blur
- Mobile: numeric keyboard (`inputmode="numeric"`)
- Clear button (×) to reset

**Progress Bar:**
- 8 segments (one per step)
- Filled = completed, Active = current (animated fill), Empty = upcoming
- Step dots with labels visible on desktop ("Salary", "Rent", "PF", etc.)
- On mobile: "Step 3 of 8" text + simple progress bar

**Transitions:**
- Step change: slide left/right (CSS transition, 200ms)
- Live preview update: smooth number count-up animation (300ms)
- FAQ expand: CSS height transition

**Back Button:**
- Always visible at top-left of wizard
- Returns to previous step, preserves all entered data

**"Start Over" button:**
- In top menu, confirms before clearing
- Preserves no data (full reset)

---

## 13. State Management Schema

```javascript
// Main app state object
const initialState = {
  
  // Navigation
  currentStep: 0, // 0 = landing, 1–8 = wizard steps, 9 = results
  
  // Step 1 — Take-Home Salary
  takeHomeSalary: {
    amount: null, // number, monthly
    frequency: 'monthly', // 'monthly' | 'annual'
  },
  
  // Step 2 — Rent & HRA
  rent: {
    paysRent: null, // boolean
    monthlyRent: null, // number
    city: null, // 'metro' | 'non-metro' | null
    receivesHRA: null, // boolean
    hraAmount: null, // number, annual (if known; else estimated)
  },
  
  // Step 3 — PF
  pf: {
    hasPF: null, // boolean | 'not_sure'
    monthlyPFDeduction: null, // number
  },
  
  // Step 4 — Investments
  investments: {
    has80C: false, // boolean
    investments80C: null, // number, annual (includes PF)
    hasHealthInsurance: false,
    healthInsuranceSelf: null, // number, annual premium
    healthInsuranceParents: null, // number, annual premium
    parentsAreSeniorCitizens: false, // boolean
    hasEducationLoan: false,
    educationLoanInterest: null, // number, annual interest paid
    hasSavingsInterest: false,
    savingsAccountInterest: null, // number, annual
    fdInterestEarned: null, // number, annual (taxable income addition)
  },
  
  // Step 5 — Home Loan
  homeLoan: {
    hasHomeLoan: false,
    propertyType: null, // 'self-occupied' | 'let-out'
    annualInterest: null, // number
    annualRentalIncome: null, // number (if let-out)
    annualPrincipalRepaid: null, // number (optional, for 80C)
  },
  
  // Step 6 — NPS
  nps: {
    hasOwnNPS: false,
    ownNPSAnnual: null, // number
    hasEmployerNPS: false,
    employerNPSAnnual: null, // number
  },
  
  // Step 7 — Other
  other: {
    hasProfessionalTax: null, // boolean
    professionalTaxAnnual: 2400, // default ₹2,400/year
    hasLTA: false,
    ltaAnnual: null, // number
    otherDeductions: null, // number (catch-all, old regime only)
  },
  
  // Step 8 — Age
  ageGroup: null, // 'below-60' | 'senior' | 'super-senior'
  
  // Computed values (derived, not stored by user)
  computed: {
    estimatedGrossAnnual: null,
    estimatedBasicAnnual: null,
    estimatedHRAAnnual: null,
    hraExemption: null,
    
    // New Regime
    newRegimeTaxableIncome: null,
    newRegimeSlabTax: null,
    newRegimeCess: null,
    newRegimeRebate: null,
    newRegimeMarginalRelief: null,
    newRegimeTotalTax: null,
    
    // Old Regime
    oldRegimeTaxableIncome: null,
    oldRegime80CTotal: null,
    oldRegimeSlabTax: null,
    oldRegimeCess: null,
    oldRegimeRebate: null,
    oldRegimeMarginalRelief: null,
    oldRegimeTotalTax: null,
    
    // Result
    betterRegime: null, // 'new' | 'old' | 'equal'
    taxSavings: null, // absolute difference
  }
};
```

---

## 14. FAQ Content per Step

### Step 1 — Take-Home Salary
**Q: What if my salary varies each month?**
A: Use your typical month. If you got a bonus last month, use a regular month without the bonus.

**Q: I work a fixed job. What about variable pay?**
A: For now, just enter your fixed monthly salary. We'll only estimate tax on that — variable pay complicates things.

**Q: I get paid every week / biweekly. How do I convert?**
A: Multiply your weekly pay by 52, divide by 12 to get monthly. Or just multiply biweekly pay by 2.17.

**Q: My salary is in USD / I work for an MNC. Do I use the INR equivalent?**
A: Enter the INR amount that actually lands in your Indian bank account.

---

### Step 2 — Rent & HRA
**Q: My company shows HRA on my payslip but I actually live with parents and pay no rent. What should I do?**
A: If you pay no rent, you can't claim HRA exemption. Select "No" for paying rent.

**Q: I pay rent to my parents. Does that count?**
A: Yes, you can pay rent to parents and claim HRA — but rent receipts and your parents must show it as rental income in their tax return.

**Q: What's the difference between metro and non-metro for HRA?**
A: If you live in Mumbai, Delhi, Chennai, or Kolkata, you're in a "metro" for HRA purposes. These cities give a 50% HRA exemption (vs 40% for all other cities).

**Q: I live in Bengaluru / Hyderabad / Pune. Is that metro?**
A: No — only Mumbai, Delhi, Chennai, and Kolkata are metros for HRA calculation. All other cities, including Bengaluru, Hyderabad, and Pune, are non-metro (40% exemption applies).

---

### Step 3 — Provident Fund
**Q: My payslip shows EPF and VPF. Which one do I enter?**
A: Enter both combined — EPF (mandatory) + VPF (voluntary). Add them up and enter the total monthly deduction.

**Q: My company deducts PF on basic salary, not total salary. Is that normal?**
A: Yes, that's the most common setup. PF is typically 12% of your basic salary, not your total CTC.

**Q: My company doesn't deduct PF. I work at a startup.**
A: Select "No". Smaller companies and startups may not be registered under EPFO if they have fewer than 20 employees.

**Q: Is PF the same as provident fund?**
A: Yes — PF, EPF (Employee Provident Fund), and Provident Fund all refer to the same thing.

---

### Step 4 — Investments & Insurance
**Q: I invest in SIPs. Does that count?**
A: Only if it's ELSS (Equity Linked Savings Scheme) — a specific type of mutual fund. Regular equity SIPs in regular funds do NOT give 80C deductions.

**Q: My LIC premium. Does it count?**
A: Yes. Life insurance premiums paid for yourself, spouse, or children count under 80C.

**Q: My company gives me health insurance. Can I count that?**
A: No — only premiums YOU pay personally (for individual/family floater policies) count under 80D. Company-paid insurance doesn't count.

**Q: What is the max 80C limit?**
A: ₹1,50,000 per year. All your 80C items combined cannot exceed this. PF + PPF + ELSS + LIC + etc = max ₹1.5 lakh.

---

### Step 5 — Home Loan
**Q: I have two home loans. What do I enter?**
A: Combine the interest from both. But note: if both are self-occupied, only one can be treated as self-occupied (the second must be deemed let-out). For simplicity in this calculator, enter the total interest and we'll apply the ₹2L cap.

**Q: My home loan is in my spouse's name. Can I still claim it?**
A: Generally no, unless you're a co-borrower or co-owner. If you're both co-owners and co-borrowers, you can each claim deductions proportionally.

**Q: What's the EMI I pay vs interest? I only know my EMI.**
A: In the early years of a loan, interest is the majority of EMI. You can find the exact interest in your bank's loan statement (usually available online). We recommend checking that.

---

### Step 6 — NPS
**Q: How do I know if my employer contributes to NPS?**
A: Check your offer letter, payslip, or ask your HR/payroll team. Look for "NPS employer contribution" or "80CCD(2)".

**Q: Is NPS the same as the pension I get from EPFO?**
A: No. EPFO/EPF is provident fund (lump sum + pension). NPS is a separate retirement savings scheme where money is invested in market-linked funds.

**Q: Can I start NPS just for tax savings?**
A: Yes. You can open an NPS account online via eNPS.nsdl.com and get up to ₹50,000 extra deduction under 80CCD(1B) in the Old Regime.

---

### Step 7 — Other Details
**Q: My state doesn't have professional tax. What do I enter?**
A: Select "No." States like Rajasthan, Uttar Pradesh, and others don't levy professional tax.

**Q: What is LTA?**
A: Leave Travel Allowance — money your employer gives you to cover travel costs when you go on leave. It's tax-exempt for actual travel within India (not for hotels, food, or international travel).

---

### Step 8 — Age
**Q: My 60th birthday is in February 2026. Am I a senior citizen?**
A: Yes. Senior citizen status for FY 2025-26 is checked on 31 March 2026. If you turn 60 before or on that date (i.e., born before 1 April 1966), you're a senior citizen.

**Q: I'm 58 now. Does age affect me?**
A: Under 60, the basic exemption in Old Regime is ₹2.5 lakh. Under 60, the New Regime is same as everyone else.

---

## 15. Accessibility & Privacy

### Accessibility Requirements
- WCAG 2.1 AA compliant
- All interactive elements have visible focus states
- Color is never the only way to convey information (icons + text always accompany color)
- Screen reader labels on all inputs (aria-label / aria-describedby)
- Touch targets minimum 44×44px on mobile
- Keyboard navigable (Tab, Enter, Escape)
- Number inputs accept both "65000" and "65,000" formats
- Error messages announced via aria-live regions

### Privacy Requirements
- **Zero backend calls.** All computation in-browser JavaScript.
- No cookies, no analytics tracking of input values
- No localStorage — session-only, clears on tab close
- No third-party scripts that could capture form data
- Privacy statement visible on landing page and in footer
- "Your data never leaves this device" messaging in UI

---

## 16. Tax Law Reference Summary

### FY 2025-26 (AY 2026-27) Key Numbers

| Item | New Regime | Old Regime |
|------|-----------|------------|
| Basic Exemption (< 60) | ₹4,00,000 | ₹2,50,000 |
| Basic Exemption (60–79) | ₹4,00,000 | ₹3,00,000 |
| Basic Exemption (80+) | ₹4,00,000 | ₹5,00,000 |
| Standard Deduction | ₹75,000 | ₹50,000 |
| 87A Rebate Threshold | ₹12,00,000 | ₹5,00,000 |
| 87A Max Rebate | ₹60,000 | ₹12,500 |
| Cess | 4% | 4% |
| 80C Limit | N/A | ₹1,50,000 |
| 80CCD(1B) NPS | N/A | ₹50,000 |
| 80CCD(2) Employer NPS | 10% of salary | 10% of salary |
| 80D Self (< 60) | N/A | ₹25,000 |
| 80D Self (60+) | N/A | ₹50,000 |
| 80D Parents (< 60) | N/A | ₹25,000 |
| 80D Parents (60+) | N/A | ₹50,000 |
| 80TTA (savings interest) | N/A | ₹10,000 |
| 80TTB (senior citizens) | N/A | ₹50,000 |
| 24(b) Home loan interest (self-occ) | N/A | ₹2,00,000 |
| HRA Exemption | Not available | Formula-based |
| LTA | Not available | Actual (2 trips/4 yrs) |
| Marginal Relief | ₹12L threshold | ₹5L threshold |

### New Regime Tax Slabs (All ages)
| Slab | Rate |
|------|------|
| 0 – ₹4,00,000 | 0% |
| ₹4,00,001 – ₹8,00,000 | 5% |
| ₹8,00,001 – ₹12,00,000 | 10% |
| ₹12,00,001 – ₹16,00,000 | 15% |
| ₹16,00,001 – ₹20,00,000 | 20% |
| ₹20,00,001 – ₹24,00,000 | 25% |
| Above ₹24,00,000 | 30% |

### Old Regime Tax Slabs (Below 60)
| Slab | Rate |
|------|------|
| 0 – ₹2,50,000 | 0% |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

### Old Regime Tax Slabs (Senior Citizen, 60–79)
| Slab | Rate |
|------|------|
| 0 – ₹3,00,000 | 0% |
| ₹3,00,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

### Old Regime Tax Slabs (Super Senior Citizen, 80+)
| Slab | Rate |
|------|------|
| 0 – ₹5,00,000 | 0% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

### Key Regulatory Notes
1. New Regime is the DEFAULT regime for FY 2025-26. Taxpayers must actively opt out via Form 10-IEA to use Old Regime.
2. Salaried individuals can switch between regimes every financial year.
3. Section 87A rebate is NOT applicable on special rate income (capital gains) — out of scope for this calculator.
4. Surcharge applies only for income > ₹50 lakh — out of scope.
5. Standard deduction under new regime was ₹50,000 in FY 2023-24, increased to ₹75,000 from FY 2024-25 onwards.
6. The 87A rebate limit under new regime was ₹25,000 (for ₹7L income) in FY 2024-25; increased to ₹60,000 (for ₹12L income) from FY 2025-26.
7. 80CCD(2) employer NPS: cap is 14% for central/state government employees, 10% for private sector.
8. Interest income from Savings Accounts: 80TTA (under 60) allows ₹10,000 deduction. 80TTB (senior citizens) allows ₹50,000 on savings + FDs combined. These are Old Regime only.
9. Loss from Let-Out property in New Regime: Cannot be set off against salary income (unlike Old Regime where up to ₹2L can be set off). Carry forward also limited.
10. LTA: Exempt for actual travel expenditure, 2 journeys per 4-year block (current block: 2022–2025). International travel not eligible.

---

*PRD Version 1.0 | FY 2025-26 | Last Verified: April 2025 | All tax figures sourced from Income Tax Act 1961, Union Budget 2025, and CBDT notifications.*

*This PRD is for product development purposes. All tax calculations in the final product should be verified by a qualified Chartered Accountant before launch.*
