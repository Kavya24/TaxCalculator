/**
 * taxEngine.js — India Tax Calculator FY 2025-26
 * Pure functions only. No React dependencies.
 * All amounts in INR (annual unless noted).
 */

// ── Slab tables ───────────────────────────────────────────────

const NEW_REGIME_SLABS = [
  { from: 0,        to: 400000,  rate: 0.00 },
  { from: 400000,   to: 800000,  rate: 0.05 },
  { from: 800000,   to: 1200000, rate: 0.10 },
  { from: 1200000,  to: 1600000, rate: 0.15 },
  { from: 1600000,  to: 2000000, rate: 0.20 },
  { from: 2000000,  to: 2400000, rate: 0.25 },
  { from: 2400000,  to: Infinity, rate: 0.30 },
]

const OLD_REGIME_SLABS_BELOW60 = [
  { from: 0,       to: 250000,  rate: 0.00 },
  { from: 250000,  to: 500000,  rate: 0.05 },
  { from: 500000,  to: 1000000, rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
]

const OLD_REGIME_SLABS_SENIOR = [
  { from: 0,       to: 300000,  rate: 0.00 },
  { from: 300000,  to: 500000,  rate: 0.05 },
  { from: 500000,  to: 1000000, rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
]

const OLD_REGIME_SLABS_SUPERSENIOR = [
  { from: 0,       to: 500000,  rate: 0.00 },
  { from: 500000,  to: 1000000, rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
]

// ── Slab tax calculation ──────────────────────────────────────

export function calcSlabTax(income, slabs) {
  let tax = 0
  const breakdown = []
  for (const slab of slabs) {
    if (income <= slab.from) break
    const taxable = Math.min(income, slab.to) - slab.from
    const slabTax = taxable * slab.rate
    tax += slabTax
    breakdown.push({
      from: slab.from,
      to: Math.min(income, slab.to),
      rate: slab.rate,
      taxableAmount: taxable,
      tax: slabTax,
    })
  }
  return { tax: Math.round(tax), breakdown }
}

function getOldSlabs(ageGroup) {
  if (ageGroup === 'super-senior') return OLD_REGIME_SLABS_SUPERSENIOR
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

// ── 87A Rebate + Marginal Relief ─────────────────────────────

export function calc87ARebate(slabTax, taxableIncome, regime, ageGroup) {
  // Super seniors not eligible for 87A
  if (ageGroup === 'super-senior') return { rebate: 0, marginalRelief: 0 }

  if (regime === 'new') {
    const THRESHOLD = 1200000
    const MAX_REBATE = 60000
    if (taxableIncome <= THRESHOLD) {
      const rebate = Math.min(slabTax, MAX_REBATE)
      return { rebate, marginalRelief: 0 }
    }
    // Marginal relief zone (~12L to ~12.75L)
    if (taxableIncome > THRESHOLD) {
      const taxWithCess = (slabTax - 0) * 1.04  // cess applied after rebate check
      const excessIncome = taxableIncome - THRESHOLD
      if (taxWithCess > excessIncome) {
        // User pays only the excess income above 12L (no cess on marginal relief amount)
        const marginalRelief = slabTax - excessIncome / 1.04
        return {
          rebate: 0,
          marginalRelief: Math.max(0, Math.round(marginalRelief)),
          isMarginalRelief: true,
          excessIncome,
        }
      }
    }
    return { rebate: 0, marginalRelief: 0 }
  }

  // Old regime
  const THRESHOLD = 500000
  const MAX_REBATE = 12500
  if (taxableIncome <= THRESHOLD) {
    const rebate = Math.min(slabTax, MAX_REBATE)
    return { rebate, marginalRelief: 0 }
  }
  // Old regime marginal relief
  if (taxableIncome > THRESHOLD && taxableIncome < THRESHOLD + 50000) {
    const excessIncome = taxableIncome - THRESHOLD
    if (slabTax > excessIncome) {
      return { rebate: 0, marginalRelief: Math.round(slabTax - excessIncome), isMarginalRelief: true }
    }
  }
  return { rebate: 0, marginalRelief: 0 }
}

// ── Cess ─────────────────────────────────────────────────────

export function calcCess(taxAfterRebate) {
  return Math.round(taxAfterRebate * 0.04)
}

// ── HRA Exemption (Old Regime only, PRD §6.4) ────────────────

export function calcHRAExemption({ hraAnnual, rentMonthly, basicAnnual, isMetro }) {
  if (!rentMonthly || rentMonthly <= 0) return 0
  const rentAnnual = rentMonthly * 12
  const rentMinusTenPct = rentAnnual - 0.10 * basicAnnual
  if (rentMinusTenPct <= 0) return 0  // EC4: rent < 10% of basic
  const cityPct = isMetro ? 0.50 : 0.40
  const exemption = Math.min(
    hraAnnual || 0,
    rentMinusTenPct,
    cityPct * basicAnnual,
  )
  return Math.max(0, Math.round(exemption))
}

// ── Reverse Salary Engine (PRD §8) ───────────────────────────

export function reverseEngineGross(takeHomePM, pfDeductionPM = 0, profTaxPM = 200) {
  // First pass: assume 0 TDS
  let estimatedGrossPM = takeHomePM + pfDeductionPM + profTaxPM

  for (let i = 0; i < 12; i++) {
    const grossPA = estimatedGrossPM * 12
    // Simple first-pass TDS: use new regime on current gross estimate
    const stdDeduction = 75000
    const taxableEst = Math.max(0, grossPA - stdDeduction - profTaxPM * 12)
    const { tax: estTax } = calcSlabTax(taxableEst, NEW_REGIME_SLABS)
    const { rebate } = calc87ARebate(estTax, taxableEst, 'new', 'below-60')
    const taxAfterRebate = Math.max(0, estTax - rebate)
    const tdsPM = (taxAfterRebate * 1.04) / 12

    const newGrossPM = takeHomePM + pfDeductionPM + profTaxPM + tdsPM
    if (Math.abs(newGrossPM - estimatedGrossPM) < 10) break
    estimatedGrossPM = newGrossPM
  }

  return Math.round(estimatedGrossPM * 12)
}

// ── Salary structure estimation ───────────────────────────────

export function estimateSalaryStructure(grossAnnual, isMetro) {
  const basic = Math.round(grossAnnual * 0.40)
  const hra   = Math.round(basic * (isMetro ? 0.50 : 0.40))
  return { basic, hra, specialAllowance: grossAnnual - basic - hra }
}

// ── 80C total (capped at 1.5L) ───────────────────────────────

function calc80CTotal(state, pfAnnual) {
  const { investments } = state
  if (!investments.has80C) return Math.min(pfAnnual, 150000)
  // investments80C already includes PF if user entered it
  return Math.min(investments.investments80C || pfAnnual, 150000)
}

// ── 80D total ────────────────────────────────────────────────

function calc80DTotal(state, ageGroup) {
  const { investments } = state
  if (!investments.hasHealthInsurance) return 0
  const selfLimit   = ageGroup !== 'below-60' ? 50000 : 25000
  const parentLimit = investments.parentsAreSeniorCitizens ? 50000 : 25000
  const selfAmt     = Math.min(investments.healthInsuranceSelf || 0, selfLimit)
  const parentAmt   = Math.min(investments.healthInsuranceParents || 0, parentLimit)
  return selfAmt + parentAmt
}

// ── 80TTA / 80TTB ────────────────────────────────────────────

function calcSavingsInterestDeduction(state, ageGroup) {
  const { investments } = state
  if (!investments.hasSavingsInterest) return 0
  const savingsAmt = investments.savingsAccountInterest || 0
  if (ageGroup !== 'below-60') {
    // 80TTB: up to 50K on savings + FD combined (FD interest already added to income)
    return Math.min(savingsAmt, 50000)
  }
  return Math.min(savingsAmt, 10000) // 80TTA
}

// ── NPS deductions ───────────────────────────────────────────

function calcNPSDeductions(state, grossAnnual) {
  const { nps } = state
  // 80CCD(2): employer NPS — valid in BOTH regimes, up to 10% of gross
  const employerNPS = nps.hasEmployerNPS
    ? Math.min(nps.employerNPSAnnual || 0, Math.round(grossAnnual * 0.10))
    : 0
  // 80CCD(1B): own NPS — Old Regime only, up to 50K extra over 80C
  const ownNPS80CDB = nps.hasOwnNPS
    ? Math.min(nps.ownNPSAnnual || 0, 50000)
    : 0
  return { employerNPS, ownNPS80CDB }
}

// ── Main computation ─────────────────────────────────────────

export function computeAll(state) {
  const { takeHomeSalary, rent, pf, other, homeLoan, ageGroup: ag } = state
  const ageGroup = ag || 'below-60'

  // Guard: need at least take-home amount
  if (!takeHomeSalary.amount) return {}

  const takeHomePM = takeHomeSalary.frequency === 'annual'
    ? takeHomeSalary.amount / 12
    : takeHomeSalary.amount

  const pfPM = pf.hasPF && pf.monthlyPFDeduction
    ? pf.monthlyPFDeduction
    : pf.hasPF === 'not_sure' ? null : 0  // estimated later

  const profTaxPM = other.hasProfessionalTax !== false
    ? (other.professionalTaxAnnual || 2400) / 12
    : 0

  // Gross
  const grossAnnual = reverseEngineGross(
    takeHomePM,
    pfPM != null ? pfPM : 0,
    profTaxPM,
  )

  const isMetro = rent.city === 'metro'
  const { basic: basicAnnual, hra: hraEstimated } = estimateSalaryStructure(grossAnnual, isMetro)

  // If user said "not sure" about PF, estimate it
  const resolvedPfAnnual = pfPM != null
    ? pfPM * 12
    : Math.min(basicAnnual * 0.12, 21600) // 12% of basic, capped at statutory limit

  const profTaxAnnual = profTaxPM * 12
  const ltaAnnual = (other.hasLTA && other.ltaAnnual) ? other.ltaAnnual : 0

  // HRA
  const hraReceivedAnnual = rent.receivesHRA
    ? (rent.hraAmount || hraEstimated)
    : 0
  const hraExemption = rent.paysRent && rent.receivesHRA
    ? calcHRAExemption({
        hraAnnual: hraReceivedAnnual,
        rentMonthly: rent.monthlyRent,
        basicAnnual,
        isMetro,
      })
    : 0

  // 80C
  const deductions80C = calc80CTotal(state, resolvedPfAnnual)

  // 80D
  const deductions80D = calc80DTotal(state, ageGroup)

  // NPS
  const { employerNPS, ownNPS80CDB } = calcNPSDeductions(state, grossAnnual)

  // Education loan
  const eduLoanInterest = state.investments.hasEducationLoan
    ? (state.investments.educationLoanInterest || 0)
    : 0

  // Savings interest deduction
  const savingsDeduction = calcSavingsInterestDeduction(state, ageGroup)

  // FD interest (added to income in BOTH regimes)
  const fdInterest = state.investments.hasSavingsInterest
    ? (state.investments.fdInterestEarned || 0)
    : 0

  // Home loan
  let homeLoanInterestOld = 0
  let homeLoanInterestNew = 0
  let rentalIncome = 0
  if (homeLoan.hasHomeLoan) {
    const interest = homeLoan.annualInterest || 0
    if (homeLoan.propertyType === 'self-occupied') {
      homeLoanInterestOld = Math.min(interest, 200000) // 24(b) cap
    } else if (homeLoan.propertyType === 'let-out') {
      rentalIncome = homeLoan.annualRentalIncome || 0
      const stdDed = Math.round(rentalIncome * 0.30) // 30% standard deduction on rental
      const netHousePropertyLoss = interest - stdDed - rentalIncome
      // In old regime: full interest deductible against rental income
      homeLoanInterestOld = Math.max(0, interest - stdDed)
      // In new regime: deductible against rental income only (no set-off against salary)
      homeLoanInterestNew = Math.max(0, interest - stdDed)
    }
  }

  // Other deductions (Old Regime catch-all)
  const otherDedOld = state.other.otherDeductions || 0

  // ── NEW REGIME ───────────────────────────────────────────

  const grossWithFDNew = grossAnnual + fdInterest + rentalIncome
  const newTaxableIncome = Math.max(0,
    grossWithFDNew
    - 75000             // Standard deduction
    - profTaxAnnual     // Sec 16(iii)
    - employerNPS       // 80CCD(2) — allowed in new regime
    - homeLoanInterestNew
  )

  const { tax: newSlabTax, breakdown: newSlabBreakdown } = calcSlabTax(newTaxableIncome, NEW_REGIME_SLABS)
  const { rebate: newRebate, marginalRelief: newMarginalRelief, isMarginalRelief: newIsMR } =
    calc87ARebate(newSlabTax, newTaxableIncome, 'new', ageGroup)
  const newTaxAfterRebate = Math.max(0, newSlabTax - newRebate - newMarginalRelief)
  const newCess = calcCess(newTaxAfterRebate)
  const newTotalTax = newTaxAfterRebate + newCess

  // ── OLD REGIME ───────────────────────────────────────────

  const grossWithFDOld = grossAnnual + fdInterest + rentalIncome
  const oldTaxableIncome = Math.max(0,
    grossWithFDOld
    - 50000             // Standard deduction
    - profTaxAnnual     // Sec 16(iii)
    - hraExemption      // 10(13A)
    - ltaAnnual         // 10(5)
    - deductions80C     // 80C (capped at 1.5L)
    - deductions80D     // 80D
    - ownNPS80CDB       // 80CCD(1B) — extra 50K NPS
    - employerNPS       // 80CCD(2)
    - eduLoanInterest   // 80E
    - savingsDeduction  // 80TTA / 80TTB
    - homeLoanInterestOld // 24(b)
    - otherDedOld
  )

  const oldSlabs = getOldSlabs(ageGroup)
  const { tax: oldSlabTax, breakdown: oldSlabBreakdown } = calcSlabTax(oldTaxableIncome, oldSlabs)
  const { rebate: oldRebate, marginalRelief: oldMarginalRelief } =
    calc87ARebate(oldSlabTax, oldTaxableIncome, 'old', ageGroup)
  const oldTaxAfterRebate = Math.max(0, oldSlabTax - oldRebate - oldMarginalRelief)
  const oldCess = calcCess(oldTaxAfterRebate)
  const oldTotalTax = oldTaxAfterRebate + oldCess

  // ── Verdict ──────────────────────────────────────────────

  const diff = Math.abs(newTotalTax - oldTotalTax)
  const betterRegime = diff < 500 ? 'equal'
    : newTotalTax < oldTotalTax ? 'new' : 'old'

  return {
    // Gross & structure
    estimatedGrossAnnual: grossAnnual,
    estimatedBasicAnnual: basicAnnual,
    estimatedHRAAnnual: hraEstimated,
    hraExemption,

    // New regime
    newRegimeTaxableIncome: newTaxableIncome,
    newRegimeSlabTax: newSlabTax,
    newRegimeRebate: newRebate,
    newRegimeMarginalRelief: newMarginalRelief,
    newRegimeIsMarginalRelief: newIsMR || false,
    newRegimeCess: newCess,
    newRegimeTotalTax: newTotalTax,
    newSlabBreakdown,

    // Old regime
    oldRegimeTaxableIncome: oldTaxableIncome,
    oldRegime80CTotal: deductions80C,
    oldRegime80D: deductions80D,
    oldRegimeHRAExemption: hraExemption,
    oldRegimeEmployerNPS: employerNPS,
    oldRegimeSlabTax: oldSlabTax,
    oldRegimeRebate: oldRebate,
    oldRegimeMarginalRelief: oldMarginalRelief,
    oldRegimeCess: oldCess,
    oldRegimeTotalTax: oldTotalTax,
    oldSlabBreakdown,

    // Deduction detail (for results page)
    deductions: {
      stdDeductionNew: 75000,
      stdDeductionOld: 50000,
      profTax: profTaxAnnual,
      hraExemption,
      lta: ltaAnnual,
      deductions80C,
      deductions80D,
      ownNPS80CDB,
      employerNPS,
      eduLoanInterest,
      savingsDeduction,
      homeLoanInterestOld,
      homeLoanInterestNew,
      otherDedOld,
      fdInterest,
      rentalIncome,
    },

    // Verdict
    betterRegime,
    taxSavings: diff,
  }
}
