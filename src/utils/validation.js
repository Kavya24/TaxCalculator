/**
 * Tax Statutory Limits and Constants for FY 2025-26
 */
export const LIMITS = {
  MIN_MONTHLY_SALARY: 10000,
  MAX_MONTHLY_SALARY: 500000,
  WARN_MONTHLY_SALARY: 20833, // Below this likely no tax
  MAX_80C: 150000,
  MAX_80D_SELF: 25000,
  MAX_80D_SELF_SENIOR: 50000,
  MAX_80D_PARENTS: 25000,
  MAX_80D_PARENTS_SENIOR: 50000,
  MAX_80TTA: 10000,
  MAX_80TTB: 50000,
  MAX_HOME_LOAN_INT_SELF: 200000,
  MAX_NPS_80CCD_1B: 50000,
  MAX_PROF_TAX: 2400,
  EMPLOYER_NPS_PERCENT_LIMIT: 0.14,
};

/**
 * Validation functions
 */
export function validateSalary(amount, frequency) {
  const monthly = frequency === 'annual' ? amount / 12 : amount;
  if (!amount || amount <= 0) return { isValid: false, message: 'Please enter a valid amount' };
  if (monthly < LIMITS.MIN_MONTHLY_SALARY) return { isValid: true, warning: 'At this income, you likely pay no tax.' };
  if (monthly > LIMITS.MAX_MONTHLY_SALARY) return { isValid: true, warning: 'This calculator is for standard salaried income. High incomes may vary.' };
  return { isValid: true };
}

export function validateRent(rentAmount, salaryAmount, frequency) {
  if (rentAmount === null || rentAmount === undefined) return { isValid: false };
  if (rentAmount <= 0) return { isValid: false, message: 'Please enter a valid rent amount' };
  
  const monthlySalary = frequency === 'annual' ? salaryAmount / 12 : salaryAmount;
  if (rentAmount > monthlySalary) {
    return { isValid: true, warning: 'Your rent seems higher than your take-home pay. Please verify.' };
  }
  return { isValid: true };
}

export function validatePF(pfAmount) {
  if (pfAmount === null || pfAmount === undefined) return { isValid: false };
  if (pfAmount <= 0) return { isValid: false, message: 'Please enter a valid amount' };
  if (pfAmount > 20000) return { isValid: true, warning: 'Your PF deduction seems very high. Please verify.' };
  return { isValid: true };
}

export function validateLimit(amount, limit, label) {
  if (amount === null || amount === undefined) return { isValid: true };
  if (amount < 0) return { isValid: false, message: 'Please enter a valid amount' };
  if (amount > limit) {
    return { isValid: true, warning: `${label} limit is ${formatCurrency(limit)}. We'll cap it at ${formatCurrency(limit)} for tax calculations.` };
  }
  return { isValid: true };
}

export function validateNPS(amount, salaryAmount, type) {
  if (amount === null || amount === undefined) return { isValid: true };
  if (amount < 0) return { isValid: false, message: 'Please enter a valid amount' };
  
  if (type === 'employer') {
    const limit = salaryAmount * LIMITS.EMPLOYER_NPS_PERCENT_LIMIT;
    if (amount > limit) {
      return { isValid: true, warning: `Employer NPS contribution usually doesn't exceed 14% of salary (${formatCurrency(limit)}). Please verify.` };
    }
  }
  
  if (type === 'own' && amount > LIMITS.MAX_NPS_80CCD_1B) {
    return { isValid: true, warning: `Extra NPS deduction (80CCD(1B)) is capped at ${formatCurrency(LIMITS.MAX_NPS_80CCD_1B)}. We'll cap it in calculations.` };
  }
  
  return { isValid: true };
}

export function formatCurrency(num) {
  if (num === null || num === undefined) return '';
  return num.toLocaleString('en-IN');
}
