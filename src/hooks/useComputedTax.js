import { useEffect } from 'react'
import { useAppState } from '../context/AppContext'
import { computeAll } from '../engine/taxEngine'

/**
 * useComputedTax
 * Runs computeAll() whenever state changes and dispatches
 * UPDATE_COMPUTED so the live preview panel (and eventually
 * results page) always has fresh data.
 */
export function useComputedTax() {
  const { state, dispatch } = useAppState()

  useEffect(() => {
    // Only compute when we have a salary entered
    if (!state.takeHomeSalary.amount) return

    try {
      const result = computeAll(state)
      if (Object.keys(result).length > 0) {
        dispatch({ type: 'UPDATE_COMPUTED', payload: result })
      }
    } catch (e) {
      // Engine errors shouldn't crash the UI
      console.warn('Tax engine error:', e)
    }
  }, [
    state.takeHomeSalary,
    state.rent,
    state.pf,
    state.investments,
    state.homeLoan,
    state.nps,
    state.other,
    state.ageGroup,
  ])
}
