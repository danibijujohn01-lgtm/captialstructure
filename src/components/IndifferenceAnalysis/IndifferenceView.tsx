import React, { useState } from 'react';
import type {
  FinancingPlan,
  CurrencyCode,
} from '../../types/finance';
import {
  calculateIndifferencePoint,
  calculateAllIndifferencePoints,
  getInterestExpense,
  getPreferenceDividend,
  getEffectiveShares,
} from '../../utils/financialFormulas';
import {
  formatCurrency,
  formatPercent,
  formatShares,
} from '../../utils/formatters';
import {
  Scale,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface IndifferenceViewProps {
  plans: FinancingPlan[];
  taxRate: number;
  expectedEbit: number;
  currency: CurrencyCode;
}

export const IndifferenceView: React.FC<IndifferenceViewProps> = ({
  plans,
  taxRate,
  expectedEbit,
  currency,
}) => {
  const [selectedPlan1Id, setSelectedPlan1Id] = useState<string>(
    plans[0]?.id || ''
  );
  const [selectedPlan2Id, setSelectedPlan2Id] = useState<string>(
    plans[1]?.id || plans[0]?.id || ''
  );

  const plan1 = plans.find((p) => p.id === selectedPlan1Id) || plans[0];
  const plan2 =
    plans.find((p) => p.id === selectedPlan2Id) ||
    plans[1] ||
    plans[0];

  // Calculate pairwise indifference
  const indiffResult = plan1 && plan2 && plan1.id !== plan2.id
    ? calculateIndifferencePoint(plan1, plan2, taxRate)
    : null;

  // Calculate all pairwise for the matrix if >= 3 plans
  const allIndifference = plans.length >= 2
    ? calculateAllIndifferencePoints(plans, taxRate)
    : [];

  const I1 = plan1 ? getInterestExpense(plan1) : 0;
  const I2 = plan2 ? getInterestExpense(plan2) : 0;
  const PD1 = plan1 ? getPreferenceDividend(plan1) : 0;
  const PD2 = plan2 ? getPreferenceDividend(plan2) : 0;
  const N1 = plan1 ? getEffectiveShares(plan1) : 1;
  const N2 = plan2 ? getEffectiveShares(plan2) : 1;

  const t = 1 - taxRate / 100;

  const isAboveIndifference =
    indiffResult &&
    indiffResult.indifferenceEbit !== null &&
    expectedEbit > indiffResult.indifferenceEbit;

  const isBelowIndifference =
    indiffResult &&
    indiffResult.indifferenceEbit !== null &&
    expectedEbit < indiffResult.indifferenceEbit;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Scale className="w-3.5 h-3.5" />
              <span>EBIT–EPS Indifference Point Analyzer</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Break-Even Operating Profit (Indifference Point)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              The EBIT level where two capital structure alternatives generate exactly equal Earnings Per Share (EPS). Above this EBIT, financial leverage amplifies returns. Below this EBIT, debt interest reduces EPS.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/10 text-right">
            <span className="text-[11px] text-indigo-200 block uppercase font-medium">
              Current Expected EBIT
            </span>
            <span className="text-lg font-mono font-bold text-white">
              {formatCurrency(expectedEbit, currency, false)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Tax Rate: {formatPercent(taxRate, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Plan 1 Selector */}
          <div className="w-full md:w-5/12 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Financing Plan 1
            </label>
            <select
              value={selectedPlan1Id}
              onChange={(e) => setSelectedPlan1Id(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === selectedPlan2Id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold flex items-center justify-center text-sm shadow-xs">
              VS
            </div>
          </div>

          {/* Plan 2 Selector */}
          <div className="w-full md:w-5/12 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Financing Plan 2
            </label>
            <select
              value={selectedPlan2Id}
              onChange={(e) => setSelectedPlan2Id(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === selectedPlan1Id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Indifference Result Card */}
      {indiffResult && (
        <div className="space-y-6">
          {indiffResult.hasIndifferencePoint && indiffResult.indifferenceEbit !== null ? (
            <>
              {/* Highlight Hero Callout */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>EBIT–EPS Equality Verification</span>
                </div>

                <blockquote className="text-base md:text-lg font-bold text-amber-950 leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
                  “At an EBIT of <span className="text-amber-700 font-mono font-extrabold underline decoration-amber-400 decoration-2">{formatCurrency(indiffResult.indifferenceEbit, currency, false)}</span>, both financing alternatives generate the same EPS of <span className="text-amber-700 font-mono font-extrabold underline decoration-amber-400 decoration-2">{formatCurrency(indiffResult.indifferenceEps, currency)}</span>. This is the EBIT–EPS indifference point.”
                </blockquote>

                {/* Plain-Language Decision Guide */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Above EBIT Case */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    isAboveIndifference
                      ? 'bg-emerald-100/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase text-emerald-900 mb-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>If Expected EBIT &gt; {formatCurrency(indiffResult.indifferenceEbit, currency, false)}</span>
                      {isAboveIndifference && (
                        <span className="ml-auto bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Current Zone
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-normal">
                      <strong>Choose {indiffResult.recommendation?.aboveEbitPlan}!</strong> When EBIT exceeds indifference EBIT, the operating return exceeds the fixed cost of debt. Financial leverage ("Trading on Equity") creates surplus return that accrues to equity shareholders.
                    </p>
                  </div>

                  {/* Below EBIT Case */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    isBelowIndifference
                      ? 'bg-blue-100/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white/80 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase text-blue-900 mb-1.5">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>If Expected EBIT &lt; {formatCurrency(indiffResult.indifferenceEbit, currency, false)}</span>
                      {isBelowIndifference && (
                        <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Current Zone
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-normal">
                      <strong>Choose {indiffResult.recommendation?.belowEbitPlan}!</strong> When operating profit is below indifference EBIT, the fixed interest charges weigh too heavily on profits, making the lower-leverage (more equity) plan deliver higher EPS.
                    </p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Parameter Comparison Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">
                    Input Parameters for Indifference Calculation
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* Plan 1 Column */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan1.color }} />
                      <h4 className="text-sm font-bold text-slate-900">{plan1.name}</h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Debt Amount:</span>
                        <span className="font-mono font-semibold">{formatCurrency(plan1.debtAmount, currency)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Annual Interest (I₁):</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(I1, currency)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Equity Shares (N₁):</span>
                        <span className="font-mono font-bold text-slate-900">{formatShares(N1)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Preference Dividend (PD₁):</span>
                        <span className="font-mono">{PD1 > 0 ? formatCurrency(PD1, currency) : '₹0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan 2 Column */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan2.color }} />
                      <h4 className="text-sm font-bold text-slate-900">{plan2.name}</h4>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Debt Amount:</span>
                        <span className="font-mono font-semibold">{formatCurrency(plan2.debtAmount, currency)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Annual Interest (I₂):</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(I2, currency)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Equity Shares (N₂):</span>
                        <span className="font-mono font-bold text-slate-900">{formatShares(N2)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Preference Dividend (PD₂):</span>
                        <span className="font-mono">{PD2 > 0 ? formatCurrency(PD2, currency) : '₹0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Mathematical Derivation Box */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Step-by-Step Mathematical Derivation</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Corporate Tax (T) = {formatPercent(taxRate, 0)} &rarr; (1 − T) = {t.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-slate-600 font-sans text-xs font-bold uppercase text-indigo-900">
                    Formula Definition:
                  </div>
                  <div className="p-2.5 bg-indigo-50/70 rounded-lg text-indigo-950 font-semibold overflow-x-auto">
                    [(EBIT − I₁) × (1 − T) − PD₁] ÷ N₁ = [(EBIT − I₂) × (1 − T) − PD₂] ÷ N₂
                  </div>

                  <div className="text-slate-600 font-sans text-xs font-bold uppercase text-indigo-900 pt-2">
                    Substituting Values:
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 overflow-x-auto">
                    [(EBIT − {formatCurrency(I1, currency, false)}) × {t.toFixed(2)} − {formatCurrency(PD1, currency, false)}] ÷ {formatShares(N1)}
                    <br />
                    = [(EBIT − {formatCurrency(I2, currency, false)}) × {t.toFixed(2)} − {formatCurrency(PD2, currency, false)}] ÷ {formatShares(N2)}
                  </div>

                  <div className="text-slate-600 font-sans text-xs font-bold uppercase text-indigo-900 pt-2">
                    Cross-Multiplying & Solving for EBIT:
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 overflow-x-auto space-y-1">
                    <div>Numerator = N₂ × [I₁(1−T) + PD₁] − N₁ × [I₂(1−T) + PD₂]</div>
                    <div>Denominator = (N₂ − N₁) × (1 − T)</div>
                    <div className="text-sm font-bold text-emerald-700 pt-1 font-sans">
                      EBIT* = {formatCurrency(indiffResult.indifferenceEbit, currency, false)}
                    </div>
                  </div>

                  <div className="text-slate-600 font-sans text-xs font-bold uppercase text-indigo-900 pt-2">
                    Proof & EPS Equality Check:
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 space-y-1 font-sans text-xs">
                    <div>
                      • {plan1.name} EPS = [({formatCurrency(indiffResult.indifferenceEbit, currency, false)} − {formatCurrency(I1, currency, false)}) × {t.toFixed(2)} − {formatCurrency(PD1, currency, false)}] ÷ {formatShares(N1)} = <strong>{formatCurrency(indiffResult.indifferenceEps, currency)}</strong>
                    </div>
                    <div>
                      • {plan2.name} EPS = [({formatCurrency(indiffResult.indifferenceEbit, currency, false)} − {formatCurrency(I2, currency, false)}) × {t.toFixed(2)} − {formatCurrency(PD2, currency, false)}] ÷ {formatShares(N2)} = <strong>{formatCurrency(indiffResult.indifferenceEps, currency)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Parallel lines or No Indifference Point */
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>No Indifference Point Exists (Parallel Lines)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {indiffResult.statusMessage}
              </p>
              <p className="text-xs text-amber-700">
                Because both financing plans have the exact same number of equity shares ({formatShares(N1)}), their slopes <span className="font-mono font-semibold">(1 − T) ÷ N</span> are identical. Therefore, their EBIT–EPS trajectory lines run parallel and never cross.
              </p>
            </div>
          )}
        </div>
      )}

      {/* All-Pairs Indifference Matrix (when >= 3 plans) */}
      {plans.length >= 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🧮 Multi-Plan Indifference Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Break-even EBIT and indifference EPS across all pairwise combinations of your financing plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Plan Pair</th>
                  <th className="py-3 px-4 text-right">Indifference EBIT</th>
                  <th className="py-3 px-4 text-right">Indifference EPS</th>
                  <th className="py-3 px-4">Dominant Above Indifference</th>
                  <th className="py-3 px-4">Dominant Below Indifference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allIndifference.map((res, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: res.plan1.color }} />
                        <span>{res.plan1.name}</span>
                        <span className="text-slate-400 font-normal">vs</span>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: res.plan2.color }} />
                        <span>{res.plan2.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">
                      {res.indifferenceEbit !== null
                        ? formatCurrency(res.indifferenceEbit, currency, false)
                        : 'Parallel Lines'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      {res.indifferenceEps !== null
                        ? formatCurrency(res.indifferenceEps, currency)
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">
                      {res.recommendation ? res.recommendation.aboveEbitPlan : '—'}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      {res.recommendation ? res.recommendation.belowEbitPlan : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
