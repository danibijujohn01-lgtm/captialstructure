import { useState, useMemo, useEffect } from 'react';
import type {
  FinancingPlan,
  PlanCalculationResult,
  CurrencyCode,
  CalculationHistoryItem,
} from './types/finance';
import {
  calculatePlanMetrics,
} from './utils/financialFormulas';
import {
  loadSavedPlans,
  savePlansToStorage,
  loadSavedEbit,
  saveEbitToStorage,
  loadSavedTaxRate,
  saveTaxRateToStorage,
  loadSavedCurrency,
  saveCurrencyToStorage,
  loadHistory,
  saveHistoryItem,
  deleteHistoryItem,
  clearHistory,
  PRESETS,
} from './utils/storage';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { EbitEpsView } from './components/EbitEpsAnalysis/EbitEpsView';
import { IndifferenceView } from './components/IndifferenceAnalysis/IndifferenceView';
import { CompareView } from './components/ComparePlans/CompareView';
import { SensitivityView } from './components/Sensitivity/SensitivityView';
import { LearningLabView } from './components/LearningLab/LearningLabView';
import { HistoryView } from './components/History/HistoryView';
import { CheckCircle2, Scale } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ebit-eps');
  const [currency, setCurrency] = useState<CurrencyCode>(loadSavedCurrency);
  const [plans, setPlans] = useState<FinancingPlan[]>(loadSavedPlans);
  const [ebit, setEbit] = useState<number>(loadSavedEbit);
  const [taxRate, setTaxRate] = useState<number>(loadSavedTaxRate);
  const [history, setHistory] = useState<CalculationHistoryItem[]>(loadHistory);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    savePlansToStorage(plans);
  }, [plans]);

  useEffect(() => {
    saveEbitToStorage(ebit);
  }, [ebit]);

  useEffect(() => {
    saveTaxRateToStorage(taxRate);
  }, [taxRate]);

  useEffect(() => {
    saveCurrencyToStorage(currency);
  }, [currency]);

  // Toast Notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Derive plan calculation results
  const results: PlanCalculationResult[] = useMemo(() => {
    return plans.map((plan) => calculatePlanMetrics(plan, ebit, taxRate));
  }, [plans, ebit, taxRate]);

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset all financing plans and inputs to default?')) {
      const preset = PRESETS.classic;
      setPlans(preset.plans);
      setEbit(preset.ebit);
      setTaxRate(preset.taxRate);
      showToast('Reset to Standard Textbook Classic case.');
    }
  };

  // Load Preset
  const handleSelectPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setPlans(preset.plans);
      setEbit(preset.ebit);
      setTaxRate(preset.taxRate);
      showToast(`Loaded preset: "${preset.name}"`);
    }
  };

  // Save current scenario to history
  const handleSaveScenario = () => {
    const scenarioName = prompt(
      'Enter a name for this scenario:',
      `Analysis ${new Date().toLocaleDateString()} (${plans.length} Plans)`
    );
    if (!scenarioName) return;

    const newItem: CalculationHistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: Date.now(),
      name: scenarioName.trim(),
      currency,
      ebit,
      taxRate,
      plans,
      resultsSummary: results.map((r) => ({
        planName: r.planName,
        eps: r.eps,
        interest: r.interestExpense,
        debtEquityRatio: r.debtEquityRatio,
      })),
    };

    const updated = saveHistoryItem(newItem);
    setHistory(updated);
    showToast(`Scenario "${newItem.name}" saved to history!`);
  };

  // Load scenario from history
  const handleLoadScenario = (item: CalculationHistoryItem) => {
    setPlans(item.plans);
    setEbit(item.ebit);
    setTaxRate(item.taxRate);
    setCurrency(item.currency);
    setActiveTab('ebit-eps');
    showToast(`Loaded scenario "${item.name}"`);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    showToast('Deleted calculation record.');
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved calculations?')) {
      clearHistory();
      setHistory([]);
      showToast('All history cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onReset={handleReset}
        onSaveScenario={handleSaveScenario}
        onSelectPreset={handleSelectPreset}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ebit-eps' && (
          <EbitEpsView
            plans={plans}
            setPlans={setPlans}
            ebit={ebit}
            setEbit={setEbit}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            currency={currency}
            results={results}
          />
        )}

        {activeTab === 'indifference' && (
          <IndifferenceView
            plans={plans}
            taxRate={taxRate}
            expectedEbit={ebit}
            currency={currency}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            results={results}
            ebit={ebit}
            taxRate={taxRate}
            currency={currency}
          />
        )}

        {activeTab === 'sensitivity' && (
          <SensitivityView
            plans={plans}
            taxRate={taxRate}
            currency={currency}
          />
        )}

        {activeTab === 'learning' && <LearningLabView />}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onLoadScenario={handleLoadScenario}
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Capital Structure Analysis Studio</span>
            <span>&bull;</span>
            <span>EBIT–EPS, Indifference & Leverage Learning System</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Supports ₹ INR, $ USD, € EUR, £ GBP</span>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('learning')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Educational Guide & Formulas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
