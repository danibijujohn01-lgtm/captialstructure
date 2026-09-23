import type { FinancingPlan, CalculationHistoryItem, CurrencyCode } from '../types/finance';

const STORAGE_KEYS = {
  PLANS: 'cap_struct_plans_v1',
  EBIT: 'cap_struct_ebit_v1',
  TAX_RATE: 'cap_struct_tax_rate_v1',
  CURRENCY: 'cap_struct_currency_v1',
  HISTORY: 'cap_struct_history_v1',
};

export const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
];

export const PRESETS: Record<
  string,
  { name: string; description: string; ebit: number; taxRate: number; plans: FinancingPlan[] }
> = {
  classic: {
    name: 'Textbook Classic (₹10 Lakhs Capital)',
    description: 'A standard university finance case comparing Pure Equity, 50% Debt, and High Leverage.',
    ebit: 200000,
    taxRate: 35,
    plans: [
      {
        id: 'plan-a',
        name: 'Plan A: All Equity',
        description: '100% Equity, Zero Financial Risk',
        color: '#3b82f6',
        debtAmount: 0,
        interestRate: 0,
        equityAmount: 1000000,
        sharePrice: 10,
        numberOfShares: 100000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'plan-b',
        name: 'Plan B: 50% Debt / 50% Equity',
        description: 'Moderate leverage with ₹5L debt at 10%',
        color: '#10b981',
        debtAmount: 500000,
        interestRate: 10,
        equityAmount: 500000,
        sharePrice: 10,
        numberOfShares: 50000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'plan-c',
        name: 'Plan C: 80% Debt (High Leverage)',
        description: 'Aggressive capital structure with ₹8L debt at 12%',
        color: '#f59e0b',
        debtAmount: 800000,
        interestRate: 12,
        equityAmount: 200000,
        sharePrice: 10,
        numberOfShares: 20000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
    ],
  },
  preference: {
    name: 'Expansion with Preference Capital (₹20 Lakhs)',
    description: 'Compares Equity, Debt, and a hybrid structure with 9% Preference Shares.',
    ebit: 400000,
    taxRate: 30,
    plans: [
      {
        id: 'pref-plan-1',
        name: 'Option 1: Pure Equity',
        description: '2,00,000 shares @ ₹10',
        color: '#3b82f6',
        debtAmount: 0,
        interestRate: 0,
        equityAmount: 2000000,
        sharePrice: 10,
        numberOfShares: 200000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'pref-plan-2',
        name: 'Option 2: Debt + Equity',
        description: '₹10L Debt @ 10% + 1,00,000 shares',
        color: '#10b981',
        debtAmount: 1000000,
        interestRate: 10,
        equityAmount: 1000000,
        sharePrice: 10,
        numberOfShares: 100000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'pref-plan-3',
        name: 'Option 3: Debt + Pref + Equity',
        description: '₹6L Debt @ 10% + ₹4L 9% Pref + 1,00,000 shares',
        color: '#8b5cf6',
        debtAmount: 600000,
        interestRate: 10,
        equityAmount: 1000000,
        sharePrice: 10,
        numberOfShares: 100000,
        preferenceCapital: 400000,
        preferenceDividendRate: 9,
      },
    ],
  },
  corporate: {
    name: 'Corporate Capital Mix (₹50 Lakhs)',
    description: 'Conservative, Balanced, and Aggressive capital structures for strategic evaluation.',
    ebit: 1000000,
    taxRate: 25,
    plans: [
      {
        id: 'corp-plan-1',
        name: 'Conservative Structure',
        description: '20% Debt @ 8.5%, 80% Equity',
        color: '#06b6d4',
        debtAmount: 1000000,
        interestRate: 8.5,
        equityAmount: 4000000,
        sharePrice: 100,
        numberOfShares: 40000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'corp-plan-2',
        name: 'Balanced Structure',
        description: '40% Debt @ 9.5%, 60% Equity',
        color: '#3b82f6',
        debtAmount: 2000000,
        interestRate: 9.5,
        equityAmount: 3000000,
        sharePrice: 100,
        numberOfShares: 30000,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
      {
        id: 'corp-plan-3',
        name: 'Aggressive Leveraged',
        description: '65% Debt @ 11%, 35% Equity',
        color: '#ef4444',
        debtAmount: 3250000,
        interestRate: 11,
        equityAmount: 1750000,
        sharePrice: 100,
        numberOfShares: 17500,
        preferenceCapital: 0,
        preferenceDividendRate: 0,
      },
    ],
  },
};

export function loadSavedPlans(): FinancingPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return PRESETS.classic.plans;
}

export function savePlansToStorage(plans: FinancingPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  } catch (err) {
    console.warn('Failed to save plans to localStorage', err);
  }
}

export function loadSavedEbit(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.EBIT);
    if (val && !isNaN(Number(val))) return Number(val);
  } catch {
    // fallback
  }
  return PRESETS.classic.ebit;
}

export function saveEbitToStorage(ebit: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EBIT, ebit.toString());
  } catch (err) {
    console.warn('Failed to save EBIT', err);
  }
}

export function loadSavedTaxRate(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TAX_RATE);
    if (val && !isNaN(Number(val))) return Number(val);
  } catch {
    // fallback
  }
  return PRESETS.classic.taxRate;
}

export function saveTaxRateToStorage(taxRate: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TAX_RATE, taxRate.toString());
  } catch (err) {
    console.warn('Failed to save Tax Rate', err);
  }
}

export function loadSavedCurrency(): CurrencyCode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    if (val && ['INR', 'USD', 'EUR', 'GBP'].includes(val)) return val;
  } catch {
    // fallback
  }
  return 'INR';
}

export function saveCurrencyToStorage(currency: CurrencyCode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  } catch (err) {
    console.warn('Failed to save currency', err);
  }
}

export function loadHistory(): CalculationHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveHistoryItem(item: CalculationHistoryItem): CalculationHistoryItem[] {
  try {
    const current = loadHistory();
    const updated = [item, ...current].slice(0, 30); // Keep last 30
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save history', err);
    return [];
  }
}

export function deleteHistoryItem(id: string): CalculationHistoryItem[] {
  try {
    const current = loadHistory();
    const updated = current.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to delete history item', err);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.warn('Failed to clear history', err);
  }
}
