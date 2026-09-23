import React from 'react';
import type {
  PlanCalculationResult,
  CurrencyCode,
} from '../../types/finance';
import {
  formatCurrency,
  formatPercent,
  formatRatio,
  formatShares,
} from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Sparkles,
  PieChart as PieIcon,
  BarChart2,
  Activity,
} from 'lucide-react';

interface CompareViewProps {
  results: PlanCalculationResult[];
  ebit: number;
  taxRate: number;
  currency: CurrencyCode;
}

export const CompareView: React.FC<CompareViewProps> = ({
  results,
  ebit,
  taxRate,
  currency,
}) => {
  // Find highest EPS, lowest debt ratio, and lowest break-even
  const maxEps = Math.max(...results.map((r) => r.eps));
  const minDebtRatio = Math.min(...results.map((r) => r.debtRatio));
  const minBreakEven = Math.min(...results.map((r) => r.financialBreakEvenEbit));

  // Prepare EPS bar chart data
  const barChartData = results.map((r) => ({
    name: r.planName,
    eps: Number(r.eps.toFixed(2)),
    color: r.color,
  }));

  // Capital Structure color scheme
  const COMPONENT_COLORS = {
    equity: '#3b82f6',
    debt: '#10b981',
    preference: '#8b5cf6',
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Capital Structure Comparison Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate capital allocation, financial risk profiles, and EPS generation across all alternative structures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Analysis EBIT</span>
            <span className="font-mono font-bold text-slate-900">
              {formatCurrency(ebit, currency, false)}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Tax Rate</span>
            <span className="font-mono font-bold text-slate-900">
              {formatPercent(taxRate, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section: Chart 2 (Donut Mix) & Chart 3 (EPS Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: EPS Comparison Bar Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>EPS Comparison at Current EBIT</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct EPS generation under EBIT of {formatCurrency(ebit, currency, false)}
              </p>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  interval={0}
                  tickFormatter={(val) => val.length > 14 ? `${val.substring(0, 12)}...` : val}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickFormatter={(v) => `${formatCurrency(v, currency)}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val), currency), 'EPS']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="eps" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Capital Structure Breakdown (Donut Charts) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                <span>Financing Structure Mix (Pie / Donut)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Relative percentage of Debt, Equity, and Preference Capital
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>Equity</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Debt</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                <span>Preference</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {results.map((r) => {
              const pieData = [
                { name: 'Equity', value: r.equityAmount, color: COMPONENT_COLORS.equity },
                { name: 'Debt', value: r.debtAmount, color: COMPONENT_COLORS.debt },
                ...(r.preferenceCapital > 0
                  ? [{ name: 'Preference', value: r.preferenceCapital, color: COMPONENT_COLORS.preference }]
                  : []),
              ];

              return (
                <div
                  key={r.planId}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-xs font-bold text-slate-800 truncate w-full mb-1">
                    {r.planName}
                  </span>

                  <div className="w-28 h-28 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={28}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any, name: any) => [
                            formatCurrency(Number(v), currency, false),
                            name,
                          ]}
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold text-slate-700">
                        {r.debtRatio.toFixed(0)}%
                      </span>
                      <span className="text-[8px] text-slate-400">Debt</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1">
                    Total: {formatCurrency(r.totalCapital, currency, false)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Financial Statement Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Detailed Financial Statement Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r) => {
            const isHighestEps = r.eps === maxEps && results.length > 1;
            const isLowestRisk = r.debtRatio === minDebtRatio;
            const isLowestBreakEven = r.financialBreakEvenEbit === minBreakEven;

            return (
              <div
                key={r.planId}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: r.color }} />

                <div className="p-5 space-y-4">
                  {/* Card Title & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-slate-900">{r.planName}</h4>
                      {isHighestEps && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Top EPS
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {isLowestRisk && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          🛡️ Lowest Financial Risk
                        </span>
                      )}
                      {isLowestBreakEven && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ⚡ Lowest Break-Even
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Statement Line Items */}
                  <div className="space-y-1.5 text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500 font-sans">Operating Profit (EBIT):</span>
                      <span className="font-bold">{formatCurrency(r.ebit, currency, false)}</span>
                    </div>

                    <div className="flex justify-between py-0.5 text-rose-600">
                      <span className="font-sans">Less: Interest Expense (I):</span>
                      <span>− {formatCurrency(r.interestExpense, currency)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-t border-slate-200 font-semibold text-slate-900">
                      <span className="font-sans">Profit Before Tax (EBT):</span>
                      <span>{formatCurrency(r.ebt, currency)}</span>
                    </div>

                    <div className="flex justify-between py-0.5 text-slate-500">
                      <span className="font-sans">Less: Tax ({formatPercent(r.taxRate, 0)}):</span>
                      <span>− {formatCurrency(r.taxAmount, currency)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-t border-slate-200 font-semibold text-slate-900">
                      <span className="font-sans">Profit After Tax (PAT):</span>
                      <span>{formatCurrency(r.pat, currency)}</span>
                    </div>

                    {r.preferenceDividend > 0 && (
                      <div className="flex justify-between py-0.5 text-purple-600">
                        <span className="font-sans">Less: Preference Dividend:</span>
                        <span>− {formatCurrency(r.preferenceDividend, currency)}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-1 border-t border-slate-300 font-bold text-slate-950">
                      <span className="font-sans">Earnings for Equity (EAES):</span>
                      <span>{formatCurrency(r.earningsForEquity, currency)}</span>
                    </div>

                    <div className="flex justify-between py-0.5 text-slate-500">
                      <span className="font-sans">Number of Equity Shares:</span>
                      <span>{formatShares(r.numberOfShares)}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-t-2 border-indigo-200 text-sm font-bold text-indigo-900 font-sans">
                      <span>Earnings Per Share (EPS):</span>
                      <span className="text-base text-indigo-600 font-mono">
                        {formatCurrency(r.eps, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Structural & Risk Ratios */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Debt-Equity (D/E):</span>
                      <span className="font-bold text-slate-800">{formatRatio(r.debtEquityRatio)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Fin. Break-Even:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(r.financialBreakEvenEbit, currency, false)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">DFL:</span>
                      <span className="font-bold text-slate-800">
                        {r.degreeOfFinancialLeverage ? `${r.degreeOfFinancialLeverage.toFixed(2)}x` : 'N/A'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Interest Coverage:</span>
                      <span className="font-bold text-slate-800">
                        {r.interestCoverageRatio ? `${r.interestCoverageRatio.toFixed(1)}x` : 'Zero Debt'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
