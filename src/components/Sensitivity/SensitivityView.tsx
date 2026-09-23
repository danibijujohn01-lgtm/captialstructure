import React, { useState, useMemo } from 'react';
import type {
  FinancingPlan,
  CurrencyCode,
} from '../../types/finance';
import { calculateSensitivity } from '../../utils/financialFormulas';
import {
  formatCurrency,
  formatCompactCurrency,
  formatPercent,
} from '../../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SensitivityViewProps {
  plans: FinancingPlan[];
  taxRate: number;
  currency: CurrencyCode;
}

const DEFAULT_SENSITIVITY_POINTS = [50000, 75000, 100000, 125000, 150000];

export const SensitivityView: React.FC<SensitivityViewProps> = ({
  plans,
  taxRate,
  currency,
}) => {
  const [ebitLevels, setEbitLevels] = useState<number[]>(DEFAULT_SENSITIVITY_POINTS);
  const [newEbitInput, setNewEbitInput] = useState<string>('');

  // Calculate sensitivity matrix
  const sensitivityData = useMemo(() => {
    const sortedLevels = [...ebitLevels].sort((a, b) => a - b);
    return calculateSensitivity(plans, sortedLevels, taxRate);
  }, [plans, ebitLevels, taxRate]);

  // Add custom point
  const handleAddEbit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newEbitInput);
    if (!isNaN(val) && val >= 0 && !ebitLevels.includes(val)) {
      setEbitLevels([...ebitLevels, val].sort((a, b) => a - b));
      setNewEbitInput('');
    }
  };

  // Remove point
  const handleRemoveEbit = (val: number) => {
    if (ebitLevels.length <= 2) {
      alert('Keep at least 2 EBIT points for sensitivity comparison.');
      return;
    }
    setEbitLevels(ebitLevels.filter((x) => x !== val));
  };

  // Reset to default points
  const handleResetDefaults = () => {
    setEbitLevels(DEFAULT_SENSITIVITY_POINTS);
  };

  // Auto-generate points around a base EBIT
  const handleGenerateStepPoints = (start: number, step: number, count: number) => {
    const points: number[] = [];
    for (let i = 0; i < count; i++) {
      points.push(start + i * step);
    }
    setEbitLevels(points);
  };

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ebitVal = Number(label);
      let bestPlan = '';
      let bestEps = -Infinity;
      payload.forEach((p: any) => {
        if (p.value > bestEps) {
          bestEps = p.value;
          bestPlan = p.name;
        }
      });

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[200px]">
          <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-2 flex justify-between">
            <span>EBIT:</span>
            <span className="font-mono text-indigo-300 font-bold">
              {formatCurrency(ebitVal, currency, false)}
            </span>
          </div>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const isBest = entry.name === bestPlan;
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className={isBest ? 'font-bold text-white' : 'text-slate-300'}>
                      {entry.name}:
                    </span>
                  </div>
                  <span className={`font-mono ${isBest ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                    {formatCurrency(entry.value, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>EBIT Sensitivity Analysis</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Simulate EPS outcomes across various operating income scenarios to identify leverage inflection points.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Standard 50k–150k</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenerateStepPoints(100000, 50000, 5)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              100k–300k
            </button>
            <button
              type="button"
              onClick={() => handleGenerateStepPoints(200000, 100000, 5)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              200k–600k
            </button>
          </div>
        </div>

        {/* Add Custom EBIT Point */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleAddEbit} className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="5000"
              placeholder="Add custom EBIT..."
              value={newEbitInput}
              onChange={(e) => setNewEbitInput(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Point</span>
            </button>
          </form>

          {/* Current Points Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">Active Levels:</span>
            {ebitLevels.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                <span>{formatCurrency(val, currency, false)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEbit(val)}
                  className="text-indigo-400 hover:text-rose-600"
                  title="Remove point"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sensitivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Sensitivity Results Table (Tax Rate: {formatPercent(taxRate, 0)})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Highlighted: Plan with Highest EPS at each level
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">EBIT Level</th>
                {plans.map((p) => (
                  <th key={p.id} className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center font-bold text-slate-900">
                  Best Alternative
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sensitivityData.map((row) => (
                <tr key={row.ebit} className="hover:bg-slate-50">
                  {/* EBIT */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatCurrency(row.ebit, currency, false)}
                  </td>

                  {/* Plan EPS Columns */}
                  {plans.map((p) => {
                    const epsVal = Number(row[p.id]) || 0;
                    const isBest = p.id === row.bestPlanId && row.maxEps > 0;

                    return (
                      <td key={p.id} className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-semibold ${
                            isBest
                              ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                              : 'text-slate-700'
                          }`}
                        >
                          {formatCurrency(epsVal, currency)}
                        </span>
                      </td>
                    );
                  })}

                  {/* Best Alternative Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>{row.bestPlanName}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensitivity Multi-Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            📈 EPS Sensitivity Trajectory Chart
          </h3>
          <p className="text-xs text-slate-500">
            Compare how steeply EPS rises with higher EBIT across each financing choice
          </p>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sensitivityData.map((s) => {
                const item: any = { ebit: s.ebit };
                plans.forEach((p) => {
                  item[p.name] = s[p.id];
                });
                return item;
              })}
              margin={{ top: 15, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="ebit"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(v) => formatCompactCurrency(v, currency)}
                tick={{ fontSize: 11, fill: '#475569' }}
                label={{
                  value: `Operating Profit (EBIT in ${currency})`,
                  position: 'insideBottom',
                  offset: -10,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <YAxis
                tickFormatter={(v) => `${formatCompactCurrency(v, currency)}`}
                tick={{ fontSize: 11, fill: '#475569' }}
                label={{
                  value: 'Earnings Per Share (EPS)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
              {plans.map((p) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={p.color}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
