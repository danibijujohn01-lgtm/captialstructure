import React from 'react';
import {
  BarChart3,
  Scale,
  GitCompare,
  TrendingUp,
  GraduationCap,
  History,
  RotateCcw,
  Save,
} from 'lucide-react';
import type { CurrencyCode } from '../../types/finance';
import { CURRENCIES } from '../../utils/formatters';

export type ActiveTab = 'ebit-eps' | 'indifference' | 'compare' | 'sensitivity' | 'learning' | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onReset: () => void;
  onSaveScenario: () => void;
  onSelectPreset: (presetKey: string) => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onReset,
  onSaveScenario,
  onSelectPreset,
  historyCount,
}) => {
  const tabs = [
    { id: 'ebit-eps', label: 'EBIT–EPS Analysis', icon: BarChart3, badge: null },
    { id: 'indifference', label: 'Break-even / Indifference', icon: Scale, badge: null },
    { id: 'compare', label: 'Compare Financing Plans', icon: GitCompare, badge: null },
    { id: 'sensitivity', label: 'Sensitivity Analysis', icon: TrendingUp, badge: null },
    { id: 'learning', label: 'Learning Lab & Formulas', icon: GraduationCap, badge: 'Guide' },
    { id: 'history', label: 'History & Scenarios', icon: History, badge: historyCount > 0 ? historyCount.toString() : null },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with title and quick actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Capital Structure Studio
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  EBIT–EPS & Leverage Lab
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Interactive financial calculator, indifference point solver & educational analyzer
              </p>
            </div>
          </div>

          {/* Action buttons and controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="px-2 font-medium text-slate-500">Currency:</span>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    currency === code
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={CURRENCIES[code].name}
                >
                  {CURRENCIES[code].symbol} {code}
                </button>
              ))}
            </div>

            {/* Preset Selector */}
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="" disabled>
                  📚 Load Case Preset...
                </option>
                <option value="classic">Standard Textbook (₹10L Capital)</option>
                <option value="preference">Expansion with Pref Shares (₹20L)</option>
                <option value="corporate">Corporate Mix (₹50L Capital)</option>
              </select>
            </div>

            {/* Save Scenario */}
            <button
              type="button"
              onClick={onSaveScenario}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600" />
              <span>Save</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:bg-rose-100 transition-colors shadow-2xs"
              title="Reset to default case"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
