import { createContext, useContext, useReducer, useEffect } from 'react'

/* ── Initial State — matches PRD §13 exactly ─────────────── */
export const initialState = {
  // Navigation (within wizard: 1–8)
  wizardStep: 1,

  // Step 1 — Take-Home Salary
  takeHomeSalary: {
    amount: null,       // number, monthly
    frequency: 'monthly', // 'monthly' | 'annual'
  },

  // Step 2 — Rent & HRA
  rent: {
    paysRent: null,     // boolean
    monthlyRent: null,  // number
    city: null,         // 'metro' | 'non-metro' | null
    receivesHRA: null,  // boolean
    hraAmount: null,    // number, annual (estimated if unknown)
  },

  // Step 3 — Provident Fund
  pf: {
    hasPF: null,              // boolean | 'not_sure'
    monthlyPFDeduction: null, // number
  },

  // Step 4 — Investments & Insurance
  investments: {
    has80C: false,
    investments80C: null,
    hasHealthInsurance: false,
    healthInsuranceSelf: null,
    healthInsuranceParents: null,
    parentsAreSeniorCitizens: false,
    hasEducationLoan: false,
    educationLoanInterest: null,
    hasSavingsInterest: false,
    savingsAccountInterest: null,
    fdInterestEarned: null,
  },

  // Step 5 — Home Loan
  homeLoan: {
    hasHomeLoan: false,
    propertyType: null,         // 'self-occupied' | 'let-out'
    annualInterest: null,
    annualRentalIncome: null,
    annualPrincipalRepaid: null,
  },

  // Step 6 — NPS
  nps: {
    hasOwnNPS: false,
    ownNPSAnnual: null,
    hasEmployerNPS: false,
    employerNPSAnnual: null,
  },

  // Step 7 — Other Income & Deductions
  other: {
    hasProfessionalTax: null,
    professionalTaxAnnual: 2400,
    hasLTA: false,
    ltaAnnual: null,
    otherDeductions: null,
  },

  // Step 8 — Age Group
  ageGroup: null, // 'below-60' | 'senior' | 'super-senior'

  // Computed values (derived — updated by engine on each input change)
  computed: {
    estimatedGrossAnnual: null,
    estimatedBasicAnnual: null,
    estimatedHRAAnnual: null,
    hraExemption: null,
    newRegimeTaxableIncome: null,
    newRegimeSlabTax: null,
    newRegimeCess: null,
    newRegimeRebate: null,
    newRegimeMarginalRelief: null,
    newRegimeTotalTax: null,
    oldRegimeTaxableIncome: null,
    oldRegime80CTotal: null,
    oldRegimeSlabTax: null,
    oldRegimeCess: null,
    oldRegimeRebate: null,
    oldRegimeMarginalRelief: null,
    oldRegimeTotalTax: null,
    betterRegime: null,   // 'new' | 'old' | 'equal'
    taxSavings: null,
  },
}

/* ── Reducer ─────────────────────────────────────────────── */
function appReducer(state, action) {
  switch (action.type) {

    case 'SET_WIZARD_STEP':
      return { ...state, wizardStep: action.payload }

    case 'UPDATE_TAKE_HOME':
      return { ...state, takeHomeSalary: { ...state.takeHomeSalary, ...action.payload } }

    case 'UPDATE_RENT':
      return { ...state, rent: { ...state.rent, ...action.payload } }

    case 'UPDATE_PF':
      return { ...state, pf: { ...state.pf, ...action.payload } }

    case 'UPDATE_INVESTMENTS':
      return { ...state, investments: { ...state.investments, ...action.payload } }

    case 'UPDATE_HOME_LOAN':
      return { ...state, homeLoan: { ...state.homeLoan, ...action.payload } }

    case 'UPDATE_NPS':
      return { ...state, nps: { ...state.nps, ...action.payload } }

    case 'UPDATE_OTHER':
      return { ...state, other: { ...state.other, ...action.payload } }

    case 'UPDATE_AGE_GROUP':
      return { ...state, ageGroup: action.payload }

    case 'UPDATE_COMPUTED':
      return { ...state, computed: { ...state.computed, ...action.payload } }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

/* ── Context ─────────────────────────────────────────────── */
const AppContext = createContext(null)

const STORAGE_KEY = 'taxclarity_state_v1'

export function AppProvider({ children }) {
  // Load from localStorage on mount
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load state from local storage:', e)
    }
    return initialState
  }

  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState)

  // Sync to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to save state to local storage:', e)
    }
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}
