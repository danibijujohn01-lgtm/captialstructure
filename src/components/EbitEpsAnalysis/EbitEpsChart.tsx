import React, { useMemo, useState } from 'react';
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
  ReferenceDot,
} from 'recharts';
import type { FinancingPlan, CurrencyCode } from '../../types/finance';
import { generateEbitGraphData } from '../../utils/financialFormulas';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { ZoomIn, ZoomOut, Info } from 'lucide-react';

interface EbitEpsChartProps {
  plans: FinancingPlan[];
  expectedEbit: number;
  taxRate: number;
  currency: CurrencyCode;
}

export const EbitEpsChart: React.FC<EbitEpsChartProps> = ({
  plans,
  expectedEbit,
  taxRate,
  currency,
}) => {
  const [zoomMultiplier, setZoomMultiplier] = useState<number>(1.6);
  const [showBreakEven, setShowBreakEven] = useState<boolean>(true);
  const [showIndifference, setShowIndifference] = useState<boolean>(true);

  // Generate chart data points
  const graphData = useMemo(() => {
    return generateEbitGraphData(plans, expectedEbit * zoomMultiplier, taxRate, 50);
  }, [plans, expectedEbit, zoomMultiplier, taxRate]);

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ebitVal = Number(label);
      // Find highest EPS among payload items
      let bestPlan = '';
      let bestEps = -Infinity;
      payload.forEach((p: any) => {
        if (p.value > bestEps) {
          bestEps = p.value;
          bestPlan = p.name;
        }
      });

      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[200px]">
          <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
            <span>EBIT Level:</span>
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
                    <span className={`truncate max-w-[120px] ${isBest ? 'font-bold text-white' : 'text-slate-300'}`}>
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

          {bestPlan && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
              <span>★ Optimal:</span>
              <span className="truncate">{bestPlan}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📊 Interactive EBIT–EPS Trajectory Graph</span>
          </h3>
          <p className="text-xs text-slate-500">
            Visualizes EPS expansion slopes and indifference intersections across operating income levels
          </p>
        </div>

        {/* Chart View Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <input
              type="checkbox"
              checked={showIndifference}
              onChange={(e) => setShowIndifference(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Indifference Points</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <input
              type="checkbox"
              checked={showBreakEven}
              onChange={(e) => setShowBreakEven(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Break-even EBIT</span>
          </label>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              type="button"
              onClick={() => setZoomMultiplier((prev) => Math.max(0.8, prev - 0.4))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-slate-500">{zoomMultiplier.toFixed(1)}x</span>
            <button
              type="button"
              onClick={() => setZoomMultiplier((prev) => Math.min(3.5, prev + 0.4))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[360px] sm:h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData.data}
            margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="ebit"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(v) => formatCompactCurrency(v, currency)}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: `Operating Profit (EBIT in ${currency})`,
                position: 'insideBottom',
                offset: -15,
                fill: '#475569',
                fontSize: 12,
                fontWeight: 600,
              }}
            />

            <YAxis
              tickFormatter={(v) => `${formatCompactCurrency(v, currency)}`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: `Earnings Per Share (EPS)`,
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

            {/* Zero EPS Axis Line */}
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />

            {/* Expected EBIT Vertical Indicator */}
            <ReferenceLine
              x={expectedEbit}
              stroke="#6366f1"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Expected EBIT: ${formatCompactCurrency(expectedEbit, currency)}`,
                position: 'top',
                fill: '#4f46e5',
                fontSize: 11,
                fontWeight: 700,
              }}
            />

            {/* Indifference Point Markers */}
            {showIndifference &&
              graphData.indifferencePoints.map((ip, idx) => (
                <ReferenceDot
                  key={`indiff-${idx}`}
                  x={ip.ebit}
                  y={ip.eps}
                  r={6}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={2}
                  label={{
                    value: `⚖️ Indiff (${formatCompactCurrency(ip.ebit, currency)})`,
                    position: 'top',
                    fill: '#b45309',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              ))}

            {/* Financial Break-Even EBIT Markers (EPS = 0) */}
            {showBreakEven &&
              graphData.breakEvenPoints.map((bep, idx) => (
                <ReferenceDot
                  key={`bep-${idx}`}
                  x={bep.ebit}
                  y={0}
                  r={5}
                  fill={bep.color}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              ))}

            {/* Plot Lines for Each Financing Plan */}
            {plans.map((plan) => (
              <Line
                key={plan.id}
                type="monotone"
                dataKey={plan.name}
                stroke={plan.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Annotation Footer */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Key Concept:</strong> Steeper lines indicate higher financial leverage (fewer equity shares). The slope of each line equals <span className="font-mono text-indigo-700 font-semibold">(1 − Tax) ÷ Number of Shares</span>.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Indifference Point</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>Expected EBIT</span>
          </span>
        </div>
      </div>
    </div>
  );
};
