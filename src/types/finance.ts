export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface FinancingPlan {
  id: string;
  name: string;
  description?: string;
  color: string;
  // Capital components
  debtAmount: number;
  interestRate: number; // in percent, e.g. 10 for 10%
  directInterest?: number; // optional manual override
  equityAmount: number;
  sharePrice: number; // Face or issue value per share
  numberOfShares: number; // Can be entered directly or computed from equityAmount / sharePrice
  preferenceCapital: number;
  preferenceDividendRate: number; // in percent, e.g. 8 for 8%
  directPreferenceDividend?: number; // optional manual override
}

export interface PlanCalculationResult {
  planId: string;
  planName: string;
  color: string;
  totalCapital: number;
  debtAmount: number;
  equityAmount: number;
  preferenceCapital: number;
  debtRatio: number; // Debt / Total Capital %
  equityRatio: number; // Equity / Total Capital %
  preferenceRatio: number; // Preference / Total Capital %
  debtEquityRatio: number; // Debt / Equity
  
  ebit: number;
  interestExpense: number;
  ebt: number; // Earnings Before Tax
  taxRate: number; // in percent
  taxAmount: number;
  pat: number; // Profit After Tax (EAT)
  preferenceDividend: number;
  earningsForEquity: number; // Earnings Available to Equity Shareholders (EAES)
  numberOfShares: number;
  eps: number; // Earnings Per Share
  
  financialBreakEvenEbit: number; // EBIT where EPS = 0
  degreeOfFinancialLeverage: number | null; // DFL
  interestCoverageRatio: number | null; // ICR = EBIT / Interest
}

export interface IndifferenceResult {
  plan1: FinancingPlan;
  plan2: FinancingPlan;
  indifferenceEbit: number | null;
  indifferenceEps: number | null;
  hasIndifferencePoint: boolean;
  isParallel: boolean;
  statusMessage: string;
  recommendation: {
    aboveEbitPlan: string;
    belowEbitPlan: string;
    explanation: string;
  } | null;
}

export interface SensitivityPoint {
  ebit: number;
  bestPlanId: string;
  bestPlanName: string;
  maxEps: number;
  [key: string]: number | string;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  name: string;
  currency: CurrencyCode;
  ebit: number;
  taxRate: number;
  plans: FinancingPlan[];
  resultsSummary: {
    planName: string;
    eps: number;
    interest: number;
    debtEquityRatio: number;
  }[];
  indifferencePointSummary?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
