import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Scale,
  TrendingUp,
  Percent,
  Award,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizQuestion } from '../../types/finance';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does the EBIT–EPS Indifference Point represent in capital structure analysis?',
    options: [
      'The EBIT level where company sales equal total operating costs',
      'The EBIT level where two alternative financing plans produce the exact same EPS',
      'The point where debt equals total equity in the balance sheet',
      'The minimum EBIT required to avoid bankruptcy',
    ],
    correctIndex: 1,
    explanation:
      'The EBIT–EPS indifference point is the operating profit level at which earnings per share (EPS) under two different capital structure plans are completely identical.',
  },
  {
    id: 2,
    question: 'If a company expects its EBIT to be consistently HIGHER than the indifference point, which financing alternative is generally preferred?',
    options: [
      'Pure equity financing because it has zero debt',
      'The plan with higher financial leverage (higher debt / fewer shares)',
      'Government subsidies',
      'Both plans are equally profitable',
    ],
    correctIndex: 1,
    explanation:
      'When EBIT exceeds the indifference point, the return earned on operating assets exceeds the fixed interest rate of debt. This favorable financial leverage ("Trading on Equity") boosts EPS for common shareholders.',
  },
  {
    id: 3,
    question: 'Why does corporate tax make debt financing attractive to corporations?',
    options: [
      'Debt holders pay corporate taxes on behalf of the company',
      'Interest expense is tax-deductible, creating an interest tax shield',
      'Dividends paid on common stock are tax-deductible',
      'Debt capital is completely free from repayment',
    ],
    correctIndex: 1,
    explanation:
      'Interest is treated as an allowable operating expense before calculating corporate income tax, reducing the firm\'s taxable income by (Interest × Tax Rate). In contrast, dividends to equity shareholders are paid from after-tax earnings.',
  },
  {
    id: 4,
    question: 'What happens to the EBIT–EPS lines if two financing plans have the exact SAME number of equity shares?',
    options: [
      'The lines intersect at EBIT = 0',
      'The lines are parallel and never intersect (no indifference point exists)',
      'The lines are perpendicular to each other',
      'The lines merge into a single curved line',
    ],
    correctIndex: 1,
    explanation:
      'The slope of an EBIT-EPS line is (1 − T) ÷ N. If both plans have the same number of shares (N), their slopes are identical, resulting in parallel lines that never cross.',
  },
  {
    id: 5,
    question: 'What is the Financial Break-Even Point of a firm?',
    options: [
      'The level of sales where EBIT is zero',
      'The level of EBIT where Earnings Per Share (EPS) equals zero',
      'The point where debt is completely paid off',
      'The market price where the stock breaks even',
    ],
    correctIndex: 1,
    explanation:
      'Financial Break-Even EBIT is the operating profit required just to cover all fixed financial charges (Interest + Preference Dividend ÷ (1 − T)), resulting in exactly zero EPS.',
  },
];

export const LearningLabView: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'guide' | 'formulas' | 'quiz'>('guide');

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    setIsSubmitted(true);
    // Check score
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    if (score >= 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleQuizReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTopic('guide')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            activeTopic === 'guide'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Concepts & Explanation</span>
        </button>

        <button
          onClick={() => setActiveTopic('formulas')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            activeTopic === 'formulas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Formula Cheat Sheet</span>
        </button>

        <button
          onClick={() => setActiveTopic('quiz')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            activeTopic === 'quiz'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Interactive Knowledge Quiz</span>
        </button>
      </div>

      {/* TOPIC 1: CONCEPTS & EXPLANATION */}
      {activeTopic === 'guide' && (
        <div className="space-y-6">
          {/* Card 1: What is Capital Structure */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Scale className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold">1. What is Capital Structure?</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Capital Structure</strong> refers to the permanent long-term financing mix of a company, represented by the proportionate relationship between <strong>debt capital</strong>, <strong>common equity capital</strong>, and <strong>preference share capital</strong> used by a company to finance its operations and growth investments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <strong className="text-blue-900 block mb-1">Common Equity</strong>
                <p className="text-slate-600">
                  Represents residual ownership. Equity shares carry no fixed obligation to pay dividends, but dilute earnings per share (EPS) and control.
                </p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <strong className="text-emerald-900 block mb-1">Debt Capital</strong>
                <p className="text-slate-600">
                  Fixed-cost borrowing (bonds, debentures, loans). Interest is legally mandatory regardless of profit, but is tax-deductible and avoids equity dilution.
                </p>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-1">Preference Capital</strong>
                <p className="text-slate-600">
                  Hybrid instrument carrying a fixed dividend rate with priority over common equity in profits and liquidation, payable after corporate taxes.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: What is EBIT-EPS Analysis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold">2. What is EBIT–EPS Analysis?</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>EBIT–EPS Analysis</strong> is a vital financial planning technique that investigates how alternative financing options affect a company\'s <strong>Earnings Per Share (EPS)</strong> across different levels of <strong>Earnings Before Interest and Taxes (EBIT)</strong>.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Because interest is a fixed financial charge, employing debt causes EPS to fluctuate more widely than EBIT. EBIT–EPS analysis charts these relationships to determine which financing plan maximizes shareholder wealth under expected operating performance.
            </p>
          </div>

          {/* Card 3: What is Break-even EBIT / Indifference Point */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Scale className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold">3. What is Break-even EBIT / Indifference Point?</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              The <strong>EBIT Indifference Point</strong> (also termed the Break-even EBIT between two alternatives) is the specific operating profit level where the <strong>EPS generated by Plan 1 equals the EPS generated by Plan 2</strong>.
            </p>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <strong className="block font-bold">The Decision Rule:</strong>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>If Expected EBIT &gt; Indifference EBIT:</strong> The financing plan with <em>higher debt / higher financial leverage</em> is superior because the return on capital exceeds debt cost, boosting EPS.
                </li>
                <li>
                  <strong>If Expected EBIT &lt; Indifference EBIT:</strong> The financing plan with <em>lower debt / higher equity</em> is superior, as the burden of fixed interest reduces earnings per share.
                </li>
                <li>
                  <strong>If Expected EBIT = Indifference EBIT:</strong> Both plans produce the identical EPS.
                </li>
              </ul>
            </div>
          </div>

          {/* Card 4: Why is EBIT-EPS Analysis Used */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold">4. Why is EBIT–EPS Analysis Used?</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              EBIT–EPS analysis enables finance executives, investors, and students to evaluate the interconnected trade-offs in corporate capital budgeting:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>📈 Operating Profit Sensitivity:</strong>
                <p className="text-slate-500 mt-1">See how small percentage shifts in EBIT trigger magnified shifts in EPS.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>🛡️ Interest Tax Shield:</strong>
                <p className="text-slate-500 mt-1">Quantify the tax deduction saved by debt: Interest × Tax Rate.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>⚡ Trading on Equity:</strong>
                <p className="text-slate-500 mt-1">Use fixed-cost debt to augment common shareholders\' rate of return.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>⚖️ Financial Risk Assessment:</strong>
                <p className="text-slate-500 mt-1">Identify the risk of bankruptcy if EBIT falls below financial break-even.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>👥 Equity Dilution:</strong>
                <p className="text-slate-500 mt-1">Weigh issuing more shares (diluting EPS) vs taking on fixed debt interest.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong>🎯 Optimal Leverage Choice:</strong>
                <p className="text-slate-500 mt-1">Select the debt-equity ratio that maximizes EPS at target EBIT.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 2: FORMULA CHEAT SHEET */}
      {activeTopic === 'formulas' && (
        <div className="space-y-4">
          {/* Formula 1: EPS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
              Formula 1: Earnings Per Share (EPS)
            </span>
            <div className="p-4 bg-indigo-50/70 rounded-xl text-indigo-950 font-mono text-sm md:text-base font-bold overflow-x-auto border border-indigo-200">
              EPS = [(EBIT − Interest) × (1 − Tax Rate) − Preference Dividend] ÷ Number of Equity Shares
            </div>
            <div className="text-xs text-slate-600 space-y-1 pl-2">
              <div>• <strong>EBIT:</strong> Earnings Before Interest and Taxes (Operating Profit)</div>
              <div>• <strong>Interest:</strong> Debt Amount × Interest Rate %</div>
              <div>• <strong>(1 − Tax Rate):</strong> Corporate Tax retention multiplier</div>
              <div>• <strong>Preference Dividend:</strong> Preference Capital × Preference Dividend Rate %</div>
              <div>• <strong>Number of Shares (N):</strong> Equity Capital ÷ Issue Price per Share</div>
            </div>
          </div>

          {/* Formula 2: Indifference Point */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
              Formula 2: EBIT–EPS Indifference Point (EBIT*)
            </span>
            <div className="p-4 bg-amber-50 rounded-xl text-amber-950 font-mono text-sm md:text-base font-bold overflow-x-auto border border-amber-200">
              EBIT* = {'{'} N₂ × [I₁(1−T) + PD₁] − N₁ × [I₂(1−T) + PD₂] {'}'} ÷ [ (N₂ − N₁) × (1 − T) ]
            </div>
            <div className="text-xs text-slate-600 space-y-1 pl-2">
              <div>• <strong>N₁, N₂:</strong> Number of equity shares under Plan 1 and Plan 2</div>
              <div>• <strong>I₁, I₂:</strong> Annual interest expense under Plan 1 and Plan 2</div>
              <div>• <strong>PD₁, PD₂:</strong> Preference dividends under Plan 1 and Plan 2</div>
              <div>• <strong>Special Note:</strong> If N₁ = N₂, lines are parallel and no indifference point exists!</div>
            </div>
          </div>

          {/* Formula 3: Financial Break-Even EBIT */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
              Formula 3: Financial Break-Even EBIT (where EPS = 0)
            </span>
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-950 font-mono text-sm md:text-base font-bold overflow-x-auto border border-emerald-200">
              EBIT_BE = Interest + [ Preference Dividend ÷ (1 − Tax Rate) ]
            </div>
            <div className="text-xs text-slate-600 space-y-1 pl-2">
              <div>• Represents the minimum operating profit required to cover fixed financial costs.</div>
              <div>• If a firm has zero debt and zero preference shares, its Financial Break-Even EBIT is 0.</div>
            </div>
          </div>

          {/* Formula 4: Degree of Financial Leverage (DFL) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
              Formula 4: Degree of Financial Leverage (DFL)
            </span>
            <div className="p-4 bg-purple-50 rounded-xl text-purple-950 font-mono text-sm md:text-base font-bold overflow-x-auto border border-purple-200">
              DFL = EBIT ÷ [ EBIT − Interest − {'('}Preference Dividend ÷ (1 − Tax Rate){')'} ]
            </div>
            <div className="text-xs text-slate-600 space-y-1 pl-2">
              <div>• Measures percentage change in EPS resulting from a 1% change in EBIT.</div>
              <div>• Higher DFL means higher financial risk and steeper EBIT-EPS trajectory slope.</div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 3: INTERACTIVE QUIZ */}
      {activeTopic === 'quiz' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Capital Structure Self-Assessment Quiz</span>
              </h3>
              <p className="text-xs text-slate-500">
                Test your mastery of EBIT–EPS analysis, financial leverage, and indifference concepts.
              </p>
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Score: {calculateScore()} / {QUIZ_QUESTIONS.length}
                </div>
                <button
                  type="button"
                  onClick={handleQuizReset}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            )}
          </div>

          {/* Quiz Questions */}
          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedIdx = selectedAnswers[q.id];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-rose-50/40 border-rose-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <div className="space-y-3 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selectedIdx === optIndex;
                          const isOptionCorrect = optIndex === q.correctIndex;

                          let optionStyle = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';

                          if (isSubmitted) {
                            if (isOptionCorrect) {
                              optionStyle = 'bg-emerald-100 border-emerald-500 font-bold text-emerald-950';
                            } else if (isOptionSelected) {
                              optionStyle = 'bg-rose-100 border-rose-500 font-semibold text-rose-950';
                            } else {
                              optionStyle = 'bg-white/50 border-slate-200 text-slate-400';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold ring-1 ring-indigo-500';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && isOptionCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                              )}
                              {isSubmitted && isOptionSelected && !isOptionCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {isSubmitted && (
                        <div className="pt-2 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block mb-0.5 font-bold">Explanation:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleQuizSubmit}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Submit Answers & Check Score
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
