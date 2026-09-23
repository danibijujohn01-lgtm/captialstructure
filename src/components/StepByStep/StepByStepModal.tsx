import React from 'react';
import { X, BookOpen } from 'lucide-react';
import type { PlanCalculationResult, CurrencyCode } from '../../types/finance';
import { formatCurrency, formatPercent, formatShares } from '../../utils/formatters';

interface StepByStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PlanCalculationResult | null;
  currency: CurrencyCode;
}

export const StepByStepModal: React.FC<StepByStepModalProps> = ({
  isOpen,
  onClose,
  result,
  currency,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-700 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{result.planName}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 font-medium">
                  Step-by-Step Breakdown
                </span>
              </div>
              <p className="text-xs text-indigo-100">
                Detailed step-by-step calculation of EPS and financial leverage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-slate-800">
          {/* Base Parameters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Expected EBIT:</span>
              <span className="font-bold text-slate-900">{formatCurrency(result.ebit, currency)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Corporate Tax:</span>
              <span className="font-bold text-slate-900">{formatPercent(result.taxRate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Debt Capital:</span>
              <span className="font-bold text-slate-900">{formatCurrency(result.debtAmount, currency)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Equity Shares:</span>
              <span className="font-bold text-slate-900">{formatShares(result.numberOfShares)}</span>
            </div>
          </div>

          {/* STEP 1 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
                Calculate Earnings Before Tax (EBT)
              </span>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                EBT = EBIT − Interest
              </span>
            </div>
            <div className="text-xs text-slate-700 font-mono pl-6 bg-white/70 p-2.5 rounded-lg border border-blue-100 space-y-1">
              <div>EBT = {formatCurrency(result.ebit, currency)} − {formatCurrency(result.interestExpense, currency)}</div>
              <div className="text-sm font-bold text-blue-900 font-sans">
                = {formatCurrency(result.ebt, currency)}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Interest expense is deducted from operating profits (EBIT) before computing taxable income.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">2</span>
                Calculate Corporate Tax
              </span>
              <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                Tax = EBT × Tax Rate
              </span>
            </div>
            <div className="text-xs text-slate-700 font-mono pl-6 bg-white/70 p-2.5 rounded-lg border border-indigo-100 space-y-1">
              <div>Tax = {formatCurrency(result.ebt, currency)} × {formatPercent(result.taxRate)}</div>
              <div className="text-sm font-bold text-indigo-900 font-sans">
                = {formatCurrency(result.taxAmount, currency)}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Notice that debt provides a tax shield because interest is tax-deductible!
            </p>
          </div>

          {/* STEP 3 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                Calculate Profit After Tax (PAT / EAT)
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                PAT = EBT − Tax
              </span>
            </div>
            <div className="text-xs text-slate-700 font-mono pl-6 bg-white/70 p-2.5 rounded-lg border border-emerald-100 space-y-1">
              <div>PAT = {formatCurrency(result.ebt, currency)} − {formatCurrency(result.taxAmount, currency)}</div>
              <div className="text-sm font-bold text-emerald-900 font-sans">
                = {formatCurrency(result.pat, currency)}
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px]">4</span>
                Earnings for Equity Shareholders
              </span>
              <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                EAES = PAT − Preference Dividend
              </span>
            </div>
            <div className="text-xs text-slate-700 font-mono pl-6 bg-white/70 p-2.5 rounded-lg border border-purple-100 space-y-1">
              <div>EAES = {formatCurrency(result.pat, currency)} − {formatCurrency(result.preferenceDividend, currency)}</div>
              <div className="text-sm font-bold text-purple-900 font-sans">
                = {formatCurrency(result.earningsForEquity, currency)}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-6">
              Preference dividends are fixed obligations paid out of after-tax profits before anything goes to common equity shareholders.
            </p>
          </div>

          {/* STEP 5 */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px]">5</span>
                Calculate Earnings Per Share (EPS)
              </span>
              <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                EPS = EAES ÷ Number of Shares
              </span>
            </div>
            <div className="text-xs text-slate-700 font-mono pl-6 bg-white/90 p-3 rounded-lg border border-amber-200 space-y-1.5">
              <div>EPS = {formatCurrency(result.earningsForEquity, currency)} ÷ {formatShares(result.numberOfShares)} shares</div>
              <div className="text-base font-extrabold text-amber-950 font-sans">
                = {formatCurrency(result.eps, currency)} per share
              </div>
            </div>
          </div>

          {/* Additional Financial Metrics */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Additional Financial Leverage Indicators
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Financial Break-Even EBIT (where EPS = 0):</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(result.financialBreakEvenEbit, currency)}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Formula: I + PD / (1 − T)
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Degree of Financial Leverage (DFL):</span>
                <span className="font-bold text-slate-900 text-sm">
                  {result.degreeOfFinancialLeverage !== null ? `${result.degreeOfFinancialLeverage.toFixed(2)}x` : 'Undefined'}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Formula: EBIT ÷ [EBIT − I − PD/(1−T)]
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
