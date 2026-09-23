import React from 'react';
import type { CalculationHistoryItem } from '../../types/finance';
import {
  formatCurrency,
  formatPercent,
} from '../../utils/formatters';
import {
  History,
  Trash2,
  Download,
  Printer,
  Upload,
  Calendar,
  Layers,
} from 'lucide-react';

interface HistoryViewProps {
  history: CalculationHistoryItem[];
  onLoadScenario: (item: CalculationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onLoadScenario,
  onDeleteItem,
  onClearHistory,
}) => {
  // Export CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;

    let csv = 'Scenario ID,Timestamp,Scenario Name,EBIT,Tax Rate,Plan Name,EPS,Interest,Debt-Equity Ratio\n';

    history.forEach((h) => {
      const dateStr = new Date(h.timestamp).toISOString();
      h.resultsSummary.forEach((r) => {
        csv += `"${h.id}","${dateStr}","${h.name.replace(/"/g, '""')}",${h.ebit},${h.taxRate},"${r.planName}",${r.eps.toFixed(2)},${r.interest.toFixed(2)},${r.debtEquityRatio.toFixed(2)}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `capital_structure_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Summary Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Calculation History & Saved Scenarios</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Revisit, restore, and analyze previously saved capital structure evaluations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Report</span>
              </button>

              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Saved Scenarios Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the <strong className="text-indigo-600 font-semibold">Save Scenario</strong> button on the top navigation bar at any time to preserve your current plans and calculations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const formattedDate = new Date(item.timestamp).toLocaleString();

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadScenario(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Load into Calculator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Scenario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scenario Snapshot Bar */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                    <span className="text-slate-400 mr-1">EBIT:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(item.ebit, item.currency, false)}
                    </span>
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                    <span className="text-slate-400 mr-1">Tax:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatPercent(item.taxRate, 0)}
                    </span>
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                    <span className="text-slate-400 mr-1">Plans:</span>
                    <span className="font-bold text-slate-900">{item.plans.length}</span>
                  </div>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2 px-3">Plan Name</th>
                        <th className="py-2 px-3 text-right">Annual Interest</th>
                        <th className="py-2 px-3 text-right">D/E Ratio</th>
                        <th className="py-2 px-3 text-right font-bold text-indigo-900">EPS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {item.resultsSummary.map((res, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{res.planName}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            {formatCurrency(res.interest, item.currency)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            {res.debtEquityRatio.toFixed(2)}x
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                            {formatCurrency(res.eps, item.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
