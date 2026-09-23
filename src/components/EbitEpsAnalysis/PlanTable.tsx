import React from 'react';
import type { PlanCalculationResult, CurrencyCode } from '../../types/finance';
import {
  formatCurrency,
  formatPercent,
  formatRatio,
  formatShares,
} from '../../utils/formatters';
import { HelpCircle, Sparkles } from 'lucide-react';

interface PlanTableProps {
  results: PlanCalculationResult[];
  currency: CurrencyCode;
  onOpenStepByStep: (result: PlanCalculationResult) => void;
}

export const PlanTable: React.FC<PlanTableProps> = ({
  results,
  currency,
  onOpenStepByStep,
}) => {
  // Find highest EPS
  const maxEps = Math.max(...results.map((r) => r.eps));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📋 Financing Plans & EPS Calculation Table</span>
          </h3>
          <p className="text-xs text-slate-500">
            Compare earnings per share, tax deductions, and financial leverage ratios side by side
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Formula: <span className="font-mono text-indigo-700 font-bold">EPS = [(EBIT − I) × (1 − T) − PD] ÷ N</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3.5 px-4">Financing Plan</th>
              <th className="py-3.5 px-3 text-right">Total Capital</th>
              <th className="py-3.5 px-3 text-right">EBIT</th>
              <th className="py-3.5 px-3 text-right">Interest (I)</th>
              <th className="py-3.5 px-3 text-right">Tax (T)</th>
              <th className="py-3.5 px-3 text-right">Pref. Div (PD)</th>
              <th className="py-3.5 px-3 text-right">Equity Shares (N)</th>
              <th className="py-3.5 px-4 text-right font-bold text-indigo-900">EPS</th>
              <th className="py-3.5 px-3 text-right">D/E Ratio</th>
              <th className="py-3.5 px-3 text-right">Fin. Break-Even</th>
              <th className="py-3.5 px-4 text-center">Step-by-Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((r) => {
              const isTopEps = r.eps === maxEps && results.length > 1 && maxEps > 0;

              return (
                <tr
                  key={r.planId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isTopEps ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Plan Name & Color Tag */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{r.planName}</span>
                          {isTopEps && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Highest EPS
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Debt: {formatPercent(r.debtRatio, 0)} | Equity: {formatPercent(r.equityRatio, 0)}
                          {r.preferenceRatio > 0 && ` | Pref: ${formatPercent(r.preferenceRatio, 0)}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Capital */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {formatCurrency(r.totalCapital, currency, false)}
                  </td>

                  {/* EBIT */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-900 font-medium">
                    {formatCurrency(r.ebit, currency, false)}
                  </td>

                  {/* Interest */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {formatCurrency(r.interestExpense, currency)}
                  </td>

                  {/* Tax */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    <div>{formatPercent(r.taxRate, 0)}</div>
                    <div className="text-[10px] text-slate-400">({formatCurrency(r.taxAmount, currency, false)})</div>
                  </td>

                  {/* Preference Dividend */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {r.preferenceDividend > 0 ? formatCurrency(r.preferenceDividend, currency) : '—'}
                  </td>

                  {/* Equity Shares */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {formatShares(r.numberOfShares)}
                  </td>

                  {/* EPS (HIGHLIGHTED) */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-sm ${
                        isTopEps
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {formatCurrency(r.eps, currency)}
                    </span>
                  </td>

                  {/* D/E Ratio */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {formatRatio(r.debtEquityRatio)}
                  </td>

                  {/* Financial Break-Even */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                    {formatCurrency(r.financialBreakEvenEbit, currency, false)}
                  </td>

                  {/* Step-by-Step Action Button */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenStepByStep(r)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Steps</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
