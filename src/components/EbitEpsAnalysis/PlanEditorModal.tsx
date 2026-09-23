import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { FinancingPlan, CurrencyCode } from '../../types/finance';
import { CURRENCIES, formatCurrency } from '../../utils/formatters';
import { COLOR_PALETTE } from '../../utils/storage';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: FinancingPlan) => void;
  initialPlan?: FinancingPlan | null;
  currency: CurrencyCode;
  existingPlanNames: string[];
}

export const PlanEditorModal: React.FC<PlanEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
  currency,
  existingPlanNames,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [directInterest, setDirectInterest] = useState<number | undefined>(undefined);
  const [useDirectInterest, setUseDirectInterest] = useState(false);

  const [equityAmount, setEquityAmount] = useState<number>(500000);
  const [sharePrice, setSharePrice] = useState<number>(10);
  const [numberOfShares, setNumberOfShares] = useState<number>(50000);
  const [customSharesEntered, setCustomSharesEntered] = useState(false);

  const [preferenceCapital, setPreferenceCapital] = useState<number>(0);
  const [preferenceDividendRate, setPreferenceDividendRate] = useState<number>(9);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPlan) {
      setName(initialPlan.name);
      setColor(initialPlan.color || COLOR_PALETTE[0]);
      setDebtAmount(initialPlan.debtAmount || 0);
      setInterestRate(initialPlan.interestRate || 0);
      setDirectInterest(initialPlan.directInterest);
      setUseDirectInterest(Boolean(initialPlan.directInterest && initialPlan.directInterest > 0));

      setEquityAmount(initialPlan.equityAmount || 0);
      setSharePrice(initialPlan.sharePrice || 10);
      setNumberOfShares(initialPlan.numberOfShares || (initialPlan.equityAmount / (initialPlan.sharePrice || 10)));
      setCustomSharesEntered(false);

      setPreferenceCapital(initialPlan.preferenceCapital || 0);
      setPreferenceDividendRate(initialPlan.preferenceDividendRate || 0);
    } else {
      // Default new plan
      setName(`Plan ${String.fromCharCode(65 + existingPlanNames.length)}`);
      setColor(COLOR_PALETTE[existingPlanNames.length % COLOR_PALETTE.length]);
      setDebtAmount(400000);
      setInterestRate(10);
      setDirectInterest(undefined);
      setUseDirectInterest(false);
      setEquityAmount(600000);
      setSharePrice(10);
      setNumberOfShares(60000);
      setCustomSharesEntered(false);
      setPreferenceCapital(0);
      setPreferenceDividendRate(8);
    }
    setErrors({});
  }, [initialPlan, isOpen, existingPlanNames.length]);

  // Recalculate number of shares if equity amount or share price changes and user didn't explicitly override
  const handleEquityChange = (val: number) => {
    setEquityAmount(val);
    if (!customSharesEntered && sharePrice > 0) {
      setNumberOfShares(Math.round(val / sharePrice));
    }
  };

  const handleSharePriceChange = (val: number) => {
    setSharePrice(val);
    if (!customSharesEntered && val > 0) {
      setNumberOfShares(Math.round(equityAmount / val));
    }
  };

  const handleSharesChange = (val: number) => {
    setNumberOfShares(val);
    setCustomSharesEntered(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Plan name is required';
    }
    if (debtAmount < 0) {
      errs.debtAmount = 'Debt amount cannot be negative';
    }
    if (interestRate < 0 || interestRate > 100) {
      errs.interestRate = 'Interest rate must be between 0% and 100%';
    }
    if (equityAmount < 0) {
      errs.equityAmount = 'Equity amount cannot be negative';
    }
    if (numberOfShares <= 0) {
      errs.numberOfShares = 'Number of shares must be greater than zero';
    }
    if (preferenceCapital < 0) {
      errs.preferenceCapital = 'Preference capital cannot be negative';
    }
    if (preferenceDividendRate < 0 || preferenceDividendRate > 100) {
      errs.preferenceDividendRate = 'Preference dividend rate must be between 0% and 100%';
    }
    if (debtAmount + equityAmount + preferenceCapital <= 0) {
      errs.totalCapital = 'Total capital must be greater than zero';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const planToSave: FinancingPlan = {
      id: initialPlan?.id || `plan-${Date.now()}`,
      name: name.trim(),
      color,
      debtAmount,
      interestRate,
      directInterest: useDirectInterest ? directInterest : undefined,
      equityAmount,
      sharePrice: sharePrice > 0 ? sharePrice : 10,
      numberOfShares,
      preferenceCapital,
      preferenceDividendRate,
    };

    onSave(planToSave);
    onClose();
  };

  if (!isOpen) return null;

  const totalCapital = debtAmount + equityAmount + preferenceCapital;
  const currencySymbol = CURRENCIES[currency].symbol;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialPlan ? 'Edit Financing Plan' : 'Add New Financing Plan'}
            </h2>
            <p className="text-xs text-slate-500">
              Configure debt, equity shares, and preference capital specifications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* General Errors */}
          {errors.totalCapital && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.totalCapital}</span>
            </div>
          )}

          {/* Plan Name & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plan Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Plan B: 40% Debt"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Theme Color</label>
              <div className="flex items-center gap-1.5 mt-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Equity Capital & Shares */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️ Equity Financing</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Equity Capital ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={equityAmount}
                  onChange={(e) => handleEquityChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Share Issue Price ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={sharePrice}
                  onChange={(e) => handleSharePriceChange(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Number of Shares (N) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={numberOfShares}
                  onChange={(e) => handleSharesChange(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-1.5 text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.numberOfShares ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.numberOfShares && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.numberOfShares}</p>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Shares = Equity Amount ÷ Share Price. You can also directly type the exact number of shares.
            </p>
          </div>

          {/* Section 2: Debt Financing */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>💳 Debt Financing & Interest</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Debt / Debentures ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Interest calculation summary */}
            <div className="text-xs text-emerald-800 bg-emerald-100/60 p-2 rounded-lg flex items-center justify-between font-medium">
              <span>Annual Interest Expense (I):</span>
              <span className="font-bold">
                {formatCurrency((debtAmount * interestRate) / 100, currency)}
              </span>
            </div>
          </div>

          {/* Section 3: Preference Capital (Optional) */}
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-3">
            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>⭐ Preference Share Capital (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Preference Capital ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={preferenceCapital}
                  onChange={(e) => setPreferenceCapital(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Preference Dividend Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={preferenceDividendRate}
                  onChange={(e) => setPreferenceDividendRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            {preferenceCapital > 0 && (
              <div className="text-xs text-purple-800 bg-purple-100/60 p-2 rounded-lg flex items-center justify-between font-medium">
                <span>Preference Dividend (PD):</span>
                <span className="font-bold">
                  {formatCurrency((preferenceCapital * preferenceDividendRate) / 100, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Total Capital Summary Card */}
          <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            <span>Total Capital Raised:</span>
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(totalCapital, currency)}
            </span>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{initialPlan ? 'Update Plan' : 'Add Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
