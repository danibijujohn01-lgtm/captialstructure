import { useState } from 'react';
import type {
  FinancingPlan,
  PlanCalculationResult,
  CurrencyCode,
} from '../../types/finance';
import { formatCurrency, formatPercent, formatShares } from '../../utils/formatters';
import { PlanTable } from './PlanTable';
import { EbitEpsChart } from './EbitEpsChart';
import { PlanEditorModal } from './PlanEditorModal';
import { StepByStepModal } from '../StepByStep/StepByStepModal';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Percent,
  Coins,
  Sparkles,
} from 'lucide-react';
import { COLOR_PALETTE } from '../../utils/storage';

interface EbitEpsViewProps {
  plans: FinancingPlan[];
  setPlans: React.Dispatch<React.SetStateAction<FinancingPlan[]>>;
  ebit: number;
  setEbit: (val: number) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  currency: CurrencyCode;
  results: PlanCalculationResult[];
}

export const EbitEpsView: React.FC<EbitEpsViewProps> = ({
  plans,
  setPlans,
  ebit,
  setEbit,
  taxRate,
  setTaxRate,
  currency,
  results,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FinancingPlan | null>(null);
  const [stepModalResult, setStepModalResult] = useState<PlanCalculationResult | null>(null);

  // Quick EBIT step adjustments
  const adjustEbit = (delta: number) => {
    setEbit(Math.max(0, ebit + delta));
  };

  // Add plan handler
  const handleOpenAdd = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  // Edit plan handler
  const handleOpenEdit = (plan: FinancingPlan) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  // Duplicate plan
  const handleDuplicate = (plan: FinancingPlan) => {
    const newPlan: FinancingPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      color: COLOR_PALETTE[(plans.length + 1) % COLOR_PALETTE.length],
    };
    setPlans([...plans, newPlan]);
  };

  // Delete plan
  const handleDelete = (id: string) => {
    if (plans.length <= 1) {
      alert('You must have at least one financing plan to analyze.');
      return;
    }
    setPlans(plans.filter((p) => p.id !== id));
  };

  // Save from modal
  const handleSavePlan = (plan: FinancingPlan) => {
    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      setPlans([...plans, plan]);
    }
  };

  // Highest EPS plan
  const bestResult = results.length > 0
    ? [...results].sort((a, b) => b.eps - a.eps)[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Top Global Controls: EBIT & Tax Rate */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Expected EBIT Control */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-indigo-600" />
                <span>Operating Profit (Expected EBIT)</span>
              </label>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {formatCurrency(ebit, currency, false)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={ebit}
                  onChange={(e) => setEbit(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-3 pr-8 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustEbit(-50000)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  -50k
                </button>
                <button
                  type="button"
                  onClick={() => adjustEbit(-10000)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  -10k
                </button>
                <button
                  type="button"
                  onClick={() => adjustEbit(10000)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  +10k
                </button>
                <button
                  type="button"
                  onClick={() => adjustEbit(50000)}
                  className="px-2 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  +50k
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="pt-1">
              <input
                type="range"
                min="0"
                max={Math.max(500000, ebit * 2)}
                step="5000"
                value={ebit}
                onChange={(e) => setEbit(parseFloat(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0</span>
                <span>{formatCurrency(Math.max(500000, ebit * 2) / 2, currency, false)}</span>
                <span>{formatCurrency(Math.max(500000, ebit * 2), currency, false)}</span>
              </div>
            </div>
          </div>

          {/* Corporate Tax Rate Control */}
          <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Corporate Tax Rate (T)</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {formatPercent(taxRate, 1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-24 px-3 py-1.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              {/* Presets */}
              <div className="flex items-center gap-1">
                {[25, 30, 35, 40].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setTaxRate(rate)}
                    className={`px-2 py-1 text-xs font-semibold rounded-md border transition-all ${
                      taxRate === rate
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Tax rate determines the tax-shield benefit of debt financing: <span className="font-mono text-slate-700 font-semibold">(1 − T)</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Financing Plans Cards Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Financing Alternatives ({plans.length})
          </h2>
          <p className="text-xs text-slate-500">
            Customize capital structures to evaluate the impact of debt, interest, and equity dilution.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Alternative Plan</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((res) => {
          const originalPlan = plans.find((p) => p.id === res.planId)!;
          const isTopEps = bestResult && bestResult.planId === res.planId && bestResult.eps > 0;

          return (
            <div
              key={res.planId}
              className={`bg-white rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between shadow-2xs ${
                isTopEps
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Color Bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: res.color }} />

              <div className="p-4 space-y-3.5 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{res.planName}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total Capital: {formatCurrency(res.totalCapital, currency, false)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => handleOpenEdit(originalPlan)}
                      className="p-1 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(originalPlan)}
                      className="p-1 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(res.planId)}
                      className="p-1 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Capital Breakdown Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${res.equityRatio}%` }}
                      title={`Equity: ${res.equityRatio.toFixed(1)}%`}
                    />
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${res.debtRatio}%` }}
                      title={`Debt: ${res.debtRatio.toFixed(1)}%`}
                    />
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: `${res.preferenceRatio}%` }}
                      title={`Preference: ${res.preferenceRatio.toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span className="text-blue-700">Eq: {res.equityRatio.toFixed(0)}%</span>
                    <span className="text-emerald-700">Debt: {res.debtRatio.toFixed(0)}%</span>
                    {res.preferenceRatio > 0 && (
                      <span className="text-purple-700">Pref: {res.preferenceRatio.toFixed(0)}%</span>
                    )}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Equity Shares (N):</span>
                    <span className="font-semibold text-slate-800">
                      {formatShares(res.numberOfShares)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Annual Interest (I):</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(res.interestExpense, currency, false)}
                    </span>
                  </div>
                </div>

                {/* EPS Highlight Box */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isTopEps
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      EPS at Current EBIT
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-900">
                      {formatCurrency(res.eps, currency)}
                    </span>
                  </div>

                  {isTopEps && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      Best EPS
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>BEP: {formatCurrency(res.financialBreakEvenEbit, currency, false)}</span>
                <button
                  type="button"
                  onClick={() => setStepModalResult(res)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Formula breakdown &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Table */}
      <PlanTable
        results={results}
        currency={currency}
        onOpenStepByStep={(res) => setStepModalResult(res)}
      />

      {/* Chart Section */}
      <EbitEpsChart
        plans={plans}
        expectedEbit={ebit}
        taxRate={taxRate}
        currency={currency}
      />

      {/* Modals */}
      <PlanEditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSavePlan}
        initialPlan={editingPlan}
        currency={currency}
        existingPlanNames={plans.map((p) => p.name)}
      />

      <StepByStepModal
        isOpen={Boolean(stepModalResult)}
        onClose={() => setStepModalResult(null)}
        result={stepModalResult}
        currency={currency}
      />
    </div>
  );
};
