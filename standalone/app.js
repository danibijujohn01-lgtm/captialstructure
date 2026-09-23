/**
 * CAPITAL STRUCTURE STUDIO - STANDALONE JAVASCRIPT APPLICATION
 * High-precision financial calculations, interactive charts, and educational modules.
 */

(function () {
  'use strict';

  // --- 1. CONSTANTS & PALETTE ---
  const COLOR_PALETTE = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  const CURRENCIES = {
    INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
    USD: { code: 'USD', symbol: '$', locale: 'en-US' },
    EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
    GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
  };

  const PRESETS = {
    classic: {
      name: 'Textbook Classic (₹10 Lakhs Capital)',
      ebit: 200000,
      taxRate: 35,
      plans: [
        { id: 'p1', name: 'Plan A: All Equity', color: '#3b82f6', debtAmount: 0, interestRate: 0, equityAmount: 1000000, sharePrice: 10, numberOfShares: 100000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'p2', name: 'Plan B: 50% Debt / 50% Equity', color: '#10b981', debtAmount: 500000, interestRate: 10, equityAmount: 500000, sharePrice: 10, numberOfShares: 50000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'p3', name: 'Plan C: 80% Debt (High Leverage)', color: '#f59e0b', debtAmount: 800000, interestRate: 12, equityAmount: 200000, sharePrice: 10, numberOfShares: 20000, preferenceCapital: 0, preferenceDividendRate: 0 }
      ]
    },
    preference: {
      name: 'Expansion with Preference Capital (₹20 Lakhs)',
      ebit: 400000,
      taxRate: 30,
      plans: [
        { id: 'pref1', name: 'Option 1: Pure Equity', color: '#3b82f6', debtAmount: 0, interestRate: 0, equityAmount: 2000000, sharePrice: 10, numberOfShares: 200000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'pref2', name: 'Option 2: Debt + Equity', color: '#10b981', debtAmount: 1000000, interestRate: 10, equityAmount: 1000000, sharePrice: 10, numberOfShares: 100000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'pref3', name: 'Option 3: Debt + Pref + Equity', color: '#8b5cf6', debtAmount: 600000, interestRate: 10, equityAmount: 1000000, sharePrice: 10, numberOfShares: 100000, preferenceCapital: 400000, preferenceDividendRate: 9 }
      ]
    },
    corporate: {
      name: 'Corporate Capital Mix (₹50 Lakhs)',
      ebit: 1000000,
      taxRate: 25,
      plans: [
        { id: 'corp1', name: 'Conservative Structure', color: '#06b6d4', debtAmount: 1000000, interestRate: 8.5, equityAmount: 4000000, sharePrice: 100, numberOfShares: 40000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'corp2', name: 'Balanced Structure', color: '#3b82f6', debtAmount: 2000000, interestRate: 9.5, equityAmount: 3000000, sharePrice: 100, numberOfShares: 30000, preferenceCapital: 0, preferenceDividendRate: 0 },
        { id: 'corp3', name: 'Aggressive Leveraged', color: '#ef4444', debtAmount: 3250000, interestRate: 11, equityAmount: 1750000, sharePrice: 100, numberOfShares: 17500, preferenceCapital: 0, preferenceDividendRate: 0 }
      ]
    }
  };

  const QUIZ_DATA = [
    {
      id: 1,
      q: 'What does the EBIT–EPS Indifference Point represent in capital structure analysis?',
      opts: [
        'The EBIT level where company sales equal total operating costs',
        'The EBIT level where two alternative financing plans produce the exact same EPS',
        'The point where debt equals total equity in the balance sheet',
        'The minimum EBIT required to avoid bankruptcy'
      ],
      ans: 1,
      exp: 'The indifference point is the EBIT level at which Earnings Per Share (EPS) under two capital structure alternatives are completely equal.'
    },
    {
      id: 2,
      q: 'If expected EBIT is HIGHER than the indifference point, which financing alternative is generally preferred?',
      opts: [
        'Pure equity financing because it has zero debt',
        'The plan with higher financial leverage (higher debt / fewer shares)',
        'Government subsidy',
        'Both plans are equally profitable'
      ],
      ans: 1,
      exp: 'When EBIT exceeds the indifference point, operating returns exceed the cost of debt, creating financial leverage surplus that accrues to equity shareholders ("Trading on Equity").'
    },
    {
      id: 3,
      q: 'Why does corporate tax make debt financing advantageous?',
      opts: [
        'Debt holders pay taxes on behalf of the company',
        'Interest expense is tax-deductible, creating an interest tax shield',
        'Equity dividends are tax-deductible',
        'Debt is completely free of risk'
      ],
      ans: 1,
      exp: 'Interest is deducted before calculating taxable profit, saving the company (Interest × Tax Rate) in taxes.'
    },
    {
      id: 4,
      q: 'What happens if two financing plans have the exact same number of equity shares?',
      opts: [
        'Their EBIT-EPS lines intersect at EBIT = 0',
        'Their lines are parallel and never intersect (no indifference point exists)',
        'They produce a single curved line',
        'They cross at infinity'
      ],
      ans: 1,
      exp: 'The slope of an EBIT-EPS line is (1 − T) ÷ N. Equal shares (N) mean identical slopes, making the lines parallel.'
    },
    {
      id: 5,
      q: 'What is the Financial Break-Even Point of a firm?',
      opts: [
        'The sales volume where EBIT is zero',
        'The level of EBIT where Earnings Per Share (EPS) equals exactly zero',
        'The point where debt is repaid in full',
        'The book value of common shares'
      ],
      ans: 1,
      exp: 'Financial Break-Even EBIT is the operating profit required just to cover fixed interest and preference dividends, leaving EPS = 0.'
    }
  ];

  // --- 2. APPLICATION STATE ---
  let state = {
    currency: 'INR',
    ebit: 200000,
    taxRate: 35,
    plans: JSON.parse(JSON.stringify(PRESETS.classic.plans)),
    sensPoints: [50000, 75000, 100000, 125000, 150000],
    history: [],
    editingPlanId: null,
    selectedPlanColor: COLOR_PALETTE[0],
    showIndiffMarkers: true,
    showBepMarkers: true,
    quizAnswers: {},
    quizSubmitted: false
  };

  // Load from LocalStorage if available
  try {
    const saved = localStorage.getItem('cap_struct_standalone_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.plans && parsed.plans.length > 0) state.plans = parsed.plans;
      if (parsed.ebit) state.ebit = parsed.ebit;
      if (parsed.taxRate) state.taxRate = parsed.taxRate;
      if (parsed.currency) state.currency = parsed.currency;
      if (parsed.history) state.history = parsed.history;
    }
  } catch (e) {
    console.warn('Storage read fallback', e);
  }

  function persistState() {
    try {
      localStorage.setItem('cap_struct_standalone_state', JSON.stringify({
        currency: state.currency,
        ebit: state.ebit,
        taxRate: state.taxRate,
        plans: state.plans,
        history: state.history
      }));
    } catch (e) {
      console.warn('Storage write fallback', e);
    }
  }

  // --- 3. FORMATTING UTILITIES ---
  function formatCurrency(val, showDec = true) {
    if (val === null || val === undefined || isNaN(val)) return `${CURRENCIES[state.currency].symbol}0.00`;
    const cfg = CURRENCIES[state.currency];
    try {
      return `${cfg.symbol}${new Intl.NumberFormat(cfg.locale, {
        minimumFractionDigits: showDec ? 2 : 0,
        maximumFractionDigits: showDec ? 2 : 0,
      }).format(val)}`;
    } catch {
      return `${cfg.symbol}${Number(val).toFixed(showDec ? 2 : 0)}`;
    }
  }

  function formatCompactCurrency(val) {
    if (isNaN(val)) return '0';
    const sym = CURRENCIES[state.currency].symbol;
    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : '';

    if (state.currency === 'INR') {
      if (abs >= 10000000) return `${sign}${sym}${(abs / 10000000).toFixed(1)} Cr`;
      if (abs >= 100000) return `${sign}${sym}${(abs / 100000).toFixed(1)} L`;
      if (abs >= 1000) return `${sign}${sym}${(abs / 1000).toFixed(0)}k`;
      return `${sign}${sym}${abs.toFixed(0)}`;
    }
    if (abs >= 1000000) return `${sign}${sym}${(abs / 1000000).toFixed(1)}M`;
    if (abs >= 1000) return `${sign}${sym}${(abs / 1000).toFixed(0)}k`;
    return `${sign}${sym}${abs.toFixed(0)}`;
  }

  function formatPercent(val, dec = 1) {
    if (val === null || val === undefined || isNaN(val)) return '0%';
    return `${Number(val).toFixed(dec)}%`;
  }

  function formatShares(val) {
    if (isNaN(val)) return '0';
    return new Intl.NumberFormat(CURRENCIES[state.currency].locale, { maximumFractionDigits: 0 }).format(Math.round(val));
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => {
      el.classList.add('hidden');
    }, 3500);
  }

  // --- 4. FINANCIAL MATH LOGIC ---
  function getPlanMetrics(plan, ebit, taxRatePercent) {
    const taxRate = Math.max(0, Math.min(100, taxRatePercent)) / 100;
    const interest = plan.directInterest || (plan.debtAmount * plan.interestRate) / 100;
    const prefDiv = plan.directPreferenceDividend || (plan.preferenceCapital * plan.preferenceDividendRate) / 100;
    const shares = plan.numberOfShares > 0 ? plan.numberOfShares : (plan.equityAmount / (plan.sharePrice || 10));

    const ebt = ebit - interest;
    const taxAmount = ebt * taxRate;
    const pat = ebt - taxAmount;
    const earningsForEquity = pat - prefDiv;
    const eps = earningsForEquity / shares;

    const totalCapital = plan.debtAmount + plan.equityAmount + plan.preferenceCapital;
    const debtRatio = totalCapital > 0 ? (plan.debtAmount / totalCapital) * 100 : 0;
    const equityRatio = totalCapital > 0 ? (plan.equityAmount / totalCapital) * 100 : 0;
    const preferenceRatio = totalCapital > 0 ? (plan.preferenceCapital / totalCapital) * 100 : 0;
    const debtEquityRatio = plan.equityAmount > 0 ? plan.debtAmount / plan.equityAmount : 0;

    const t = 1 - taxRate;
    const financialBreakEvenEbit = t > 0 ? interest + prefDiv / t : interest + prefDiv;
    const dflDenom = ebit - financialBreakEvenEbit;
    const dfl = Math.abs(dflDenom) > 0.0001 ? ebit / dflDenom : null;
    const icr = interest > 0 ? ebit / interest : null;

    return {
      planId: plan.id,
      planName: plan.name,
      color: plan.color,
      totalCapital,
      debtAmount: plan.debtAmount,
      equityAmount: plan.equityAmount,
      preferenceCapital: plan.preferenceCapital,
      debtRatio,
      equityRatio,
      preferenceRatio,
      debtEquityRatio,
      ebit,
      interestExpense: interest,
      ebt,
      taxRate: taxRatePercent,
      taxAmount,
      pat,
      preferenceDividend: prefDiv,
      earningsForEquity,
      numberOfShares: shares,
      eps,
      financialBreakEvenEbit,
      degreeOfFinancialLeverage: dfl,
      interestCoverageRatio: icr
    };
  }

  function calculateIndifference(plan1, plan2, taxRatePercent) {
    const taxRate = Math.max(0, Math.min(100, taxRatePercent)) / 100;
    const t = 1 - taxRate;

    const I1 = plan1.directInterest || (plan1.debtAmount * plan1.interestRate) / 100;
    const I2 = plan2.directInterest || (plan2.debtAmount * plan2.interestRate) / 100;
    const PD1 = plan1.directPreferenceDividend || (plan1.preferenceCapital * plan1.preferenceDividendRate) / 100;
    const PD2 = plan2.directPreferenceDividend || (plan2.preferenceCapital * plan2.preferenceDividendRate) / 100;
    const N1 = plan1.numberOfShares || (plan1.equityAmount / (plan1.sharePrice || 10));
    const N2 = plan2.numberOfShares || (plan2.equityAmount / (plan2.sharePrice || 10));

    if (Math.abs(N1 - N2) < 0.0001) {
      return { isParallel: true, hasPoint: false, ebit: null, eps: null, plan1, plan2 };
    }

    const burden1 = I1 * t + PD1;
    const burden2 = I2 * t + PD2;
    const num = N2 * burden1 - N1 * burden2;
    const den = (N2 - N1) * t;

    if (Math.abs(den) < 0.00001) {
      return { isParallel: false, hasPoint: false, ebit: null, eps: null, plan1, plan2 };
    }

    const indiffEbit = num / den;
    const indiffEps = ((indiffEbit - I1) * t - PD1) / N1;

    const steeperPlan = N1 < N2 ? plan1 : plan2;
    const flatterPlan = N1 < N2 ? plan2 : plan1;

    return {
      isParallel: false,
      hasPoint: true,
      ebit: indiffEbit,
      eps: indiffEps,
      plan1,
      plan2,
      steeperPlan,
      flatterPlan
    };
  }

  // --- 5. RENDER FUNCTIONS ---
  function renderAll() {
    renderGlobalBadges();
    renderPlanCards();
    renderMasterTable();
    drawEbitEpsChart();
    renderIndifferenceView();
    renderCompareView();
    renderSensitivityView();
    renderQuiz();
    renderHistory();
    persistState();
  }

  function renderGlobalBadges() {
    document.getElementById('ebit-badge').textContent = formatCurrency(state.ebit, false);
    document.getElementById('tax-badge').textContent = `${state.taxRate}%`;
    document.getElementById('plans-count').textContent = state.plans.length;
    document.getElementById('slider-max').textContent = formatCurrency(Math.max(500000, state.ebit * 2), false);
    document.getElementById('slider-mid').textContent = formatCurrency(Math.max(500000, state.ebit * 2) / 2, false);

    // Update active currency button
    document.querySelectorAll('.curr-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-currency') === state.currency);
    });

    // Update currency symbols in labels
    document.querySelectorAll('.curr-sym').forEach(el => {
      el.textContent = CURRENCIES[state.currency].symbol;
    });
  }

  function renderPlanCards() {
    const grid = document.getElementById('plans-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const results = state.plans.map(p => getPlanMetrics(p, state.ebit, state.taxRate));
    const maxEps = Math.max(...results.map(r => r.eps));

    results.forEach(r => {
      const isTop = r.eps === maxEps && results.length > 1 && maxEps > 0;
      const card = document.createElement('div');
      card.className = `plan-card ${isTop ? 'highlight-best' : ''}`;

      card.innerHTML = `
        <div class="card-color-stripe" style="background-color: ${r.color};"></div>
        <div class="plan-card-body">
          <div class="plan-card-head">
            <div>
              <div class="plan-card-title">${r.planName}</div>
              <div class="plan-card-sub">Total Capital: ${formatCurrency(r.totalCapital, false)}</div>
            </div>
            <div class="plan-actions-group">
              <button class="icon-btn edit-plan" data-id="${r.planId}" title="Edit Plan">✏️</button>
              <button class="icon-btn duplicate-plan" data-id="${r.planId}" title="Duplicate">📋</button>
              <button class="icon-btn danger delete-plan" data-id="${r.planId}" title="Delete">🗑️</button>
            </div>
          </div>

          <div class="ratio-stack-wrap">
            <div class="ratio-stack-bar">
              <div class="ratio-seg" style="width: ${r.equityRatio}%; background: var(--blue);" title="Equity: ${r.equityRatio.toFixed(0)}%"></div>
              <div class="ratio-seg" style="width: ${r.debtRatio}%; background: var(--success);" title="Debt: ${r.debtRatio.toFixed(0)}%"></div>
              ${r.preferenceRatio > 0 ? `<div class="ratio-seg" style="width: ${r.preferenceRatio}%; background: var(--purple);" title="Pref: ${r.preferenceRatio.toFixed(0)}%"></div>` : ''}
            </div>
            <div class="ratio-labels">
              <span style="color: var(--blue);">Eq: ${r.equityRatio.toFixed(0)}%</span>
              <span style="color: var(--success);">Debt: ${r.debtRatio.toFixed(0)}%</span>
              ${r.preferenceRatio > 0 ? `<span style="color: var(--purple);">Pref: ${r.preferenceRatio.toFixed(0)}%</span>` : ''}
            </div>
          </div>

          <div class="ratio-grid">
            <div class="ratio-box">
              <span class="ratio-box-label">Equity Shares (N)</span>
              <span class="ratio-box-val font-mono">${formatShares(r.numberOfShares)}</span>
            </div>
            <div class="ratio-box">
              <span class="ratio-box-label">Annual Interest (I)</span>
              <span class="ratio-box-val font-mono">${formatCurrency(r.interestExpense, false)}</span>
            </div>
          </div>

          <div class="card-eps-box ${isTop ? 'highlight' : ''}">
            <div>
              <span class="eps-label">EPS at Current EBIT</span>
              <span class="eps-val font-mono">${formatCurrency(r.eps)}</span>
            </div>
            ${isTop ? '<span class="best-badge">★ Highest EPS</span>' : ''}
          </div>
        </div>
        <div class="plan-card-footer">
          <span>Break-Even EBIT: <strong>${formatCurrency(r.financialBreakEvenEbit, false)}</strong></span>
          <button type="button" class="link-btn view-steps-btn" data-id="${r.planId}">Formula Steps &rarr;</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach card event handlers
    grid.querySelectorAll('.edit-plan').forEach(btn => {
      btn.addEventListener('click', () => openPlanModal(btn.getAttribute('data-id')));
    });
    grid.querySelectorAll('.duplicate-plan').forEach(btn => {
      btn.addEventListener('click', () => duplicatePlan(btn.getAttribute('data-id')));
    });
    grid.querySelectorAll('.delete-plan').forEach(btn => {
      btn.addEventListener('click', () => deletePlan(btn.getAttribute('data-id')));
    });
    grid.querySelectorAll('.view-steps-btn').forEach(btn => {
      btn.addEventListener('click', () => openStepModal(btn.getAttribute('data-id')));
    });
  }

  function renderMasterTable() {
    const tbody = document.getElementById('master-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const results = state.plans.map(p => getPlanMetrics(p, state.ebit, state.taxRate));
    const maxEps = Math.max(...results.map(r => r.eps));

    results.forEach(r => {
      const isTop = r.eps === maxEps && results.length > 1 && maxEps > 0;
      const tr = document.createElement('tr');
      if (isTop) tr.className = 'row-best';

      tr.innerHTML = `
        <td>
          <div class="plan-cell-wrap">
            <span class="cell-dot" style="background-color: ${r.color};"></span>
            <div>
              <strong>${r.planName}</strong>
              <div style="font-size: 0.65rem; color: var(--slate-400);">Debt: ${r.debtRatio.toFixed(0)}% | Eq: ${r.equityRatio.toFixed(0)}%</div>
            </div>
          </div>
        </td>
        <td class="text-right font-mono">${formatCurrency(r.totalCapital, false)}</td>
        <td class="text-right font-mono font-bold">${formatCurrency(r.ebit, false)}</td>
        <td class="text-right font-mono">${formatCurrency(r.interestExpense)}</td>
        <td class="text-right font-mono">${formatPercent(r.taxRate, 0)} <span style="font-size: 0.65rem; color: var(--slate-400);">(${formatCurrency(r.taxAmount, false)})</span></td>
        <td class="text-right font-mono">${r.preferenceDividend > 0 ? formatCurrency(r.preferenceDividend) : '—'}</td>
        <td class="text-right font-mono">${formatShares(r.numberOfShares)}</td>
        <td class="text-right font-mono">
          <span class="eps-pill ${isTop ? 'best' : ''}">${formatCurrency(r.eps)}</span>
        </td>
        <td class="text-right font-mono">${r.debtEquityRatio.toFixed(2)}x</td>
        <td class="text-right font-mono">${formatCurrency(r.financialBreakEvenEbit, false)}</td>
        <td class="text-center">
          <button type="button" class="btn btn-outline view-steps-btn" data-id="${r.planId}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">View Steps</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-steps-btn').forEach(btn => {
      btn.addEventListener('click', () => openStepModal(btn.getAttribute('data-id')));
    });
  }

  // --- 6. CANVAS CHART RENDERING ---
  function drawEbitEpsChart() {
    const canvas = document.getElementById('ebitEpsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 65;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 50;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Collect key values
    const results = state.plans.map(p => getPlanMetrics(p, state.ebit, state.taxRate));
    const allIndiff = [];
    for (let i = 0; i < state.plans.length; i++) {
      for (let j = i + 1; j < state.plans.length; j++) {
        const ind = calculateIndifference(state.plans[i], state.plans[j], state.taxRate);
        if (ind.hasPoint) allIndiff.push(ind);
      }
    }

    const minX = 0;
    const maxX = Math.max(state.ebit * 1.8, 100000, ...results.map(r => r.financialBreakEvenEbit * 1.5), ...allIndiff.map(i => i.ebit * 1.2));

    // Calculate minY & maxY across plans
    let minY = 0;
    let maxY = 1;
    state.plans.forEach(p => {
      const m0 = getPlanMetrics(p, minX, state.taxRate);
      const mMax = getPlanMetrics(p, maxX, state.taxRate);
      minY = Math.min(minY, m0.eps, mMax.eps);
      maxY = Math.max(maxY, m0.eps, mMax.eps);
    });
    maxY *= 1.15;
    if (minY < 0) minY *= 1.15;

    const scaleX = val => padLeft + ((val - minX) / (maxX - minX)) * plotW;
    const scaleY = val => padTop + plotH - ((val - minY) / (maxY - minY)) * plotH;

    // Gridlines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';

    // Horizontal grid
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const yVal = minY + (i / ySteps) * (maxY - minY);
      const py = scaleY(yVal);
      ctx.beginPath();
      ctx.moveTo(padLeft, py);
      ctx.lineTo(width - padRight, py);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(yVal), padLeft - 8, py + 3);
    }

    // Vertical grid
    const xSteps = 6;
    for (let i = 0; i <= xSteps; i++) {
      const xVal = minX + (i / xSteps) * (maxX - minX);
      const px = scaleX(xVal);
      ctx.beginPath();
      ctx.moveTo(px, padTop);
      ctx.lineTo(px, padTop + plotH);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillText(formatCompactCurrency(xVal), px, padTop + plotH + 18);
    }

    // Zero EPS line
    if (minY <= 0 && maxY >= 0) {
      const py0 = scaleY(0);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, py0);
      ctx.lineTo(width - padRight, py0);
      ctx.stroke();
    }

    // Expected EBIT vertical indicator
    const pxEbit = scaleX(state.ebit);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pxEbit, padTop);
    ctx.lineTo(pxEbit, padTop + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Expected EBIT top label
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Expected EBIT: ${formatCompactCurrency(state.ebit)}`, pxEbit, padTop - 8);

    // Plot Plan Lines
    state.plans.forEach(plan => {
      ctx.strokeStyle = plan.color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const numPoints = 40;
      for (let i = 0; i <= numPoints; i++) {
        const x = minX + (i / numPoints) * (maxX - minX);
        const eps = getPlanMetrics(plan, x, state.taxRate).eps;
        const px = scaleX(x);
        const py = scaleY(eps);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Break-even markers (where EPS = 0)
    if (state.showBepMarkers) {
      results.forEach(r => {
        if (r.financialBreakEvenEbit >= minX && r.financialBreakEvenEbit <= maxX) {
          const px = scaleX(r.financialBreakEvenEbit);
          const py = scaleY(0);
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // Indifference Points
    if (state.showIndiffMarkers) {
      allIndiff.forEach(ind => {
        if (ind.ebit >= minX && ind.ebit <= maxX) {
          const px = scaleX(ind.ebit);
          const py = scaleY(ind.eps);

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#b45309';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Indiff (${formatCompactCurrency(ind.ebit)})`, px, py - 11);
        }
      });
    }
  }

  // --- 7. INDIFFERENCE VIEW RENDERING ---
  function renderIndifferenceView() {
    const s1 = document.getElementById('indiff-plan1-select');
    const s2 = document.getElementById('indiff-plan2-select');
    if (!s1 || !s2) return;

    // Populate selects
    const val1 = s1.value || state.plans[0]?.id;
    const val2 = s2.value || state.plans[1]?.id || state.plans[0]?.id;

    s1.innerHTML = '';
    s2.innerHTML = '';

    state.plans.forEach(p => {
      s1.innerHTML += `<option value="${p.id}" ${p.id === val1 ? 'selected' : ''}>${p.name}</option>`;
      s2.innerHTML += `<option value="${p.id}" ${p.id === val2 ? 'selected' : ''}>${p.name}</option>`;
    });

    document.getElementById('indiff-current-ebit').textContent = formatCurrency(state.ebit, false);
    document.getElementById('indiff-current-tax').textContent = `Tax Rate: ${state.taxRate}%`;

    const plan1 = state.plans.find(p => p.id === s1.value) || state.plans[0];
    const plan2 = state.plans.find(p => p.id === s2.value) || state.plans[1] || state.plans[0];

    const container = document.getElementById('indiff-result-container');
    if (!container) return;

    if (!plan1 || !plan2 || plan1.id === plan2.id) {
      container.innerHTML = '<div class="card p-5 text-center text-slate-500">Please choose two distinct financing plans to analyze indifference.</div>';
      return;
    }

    const ind = calculateIndifference(plan1, plan2, state.taxRate);

    if (ind.hasPoint) {
      const isAbove = state.ebit > ind.ebit;
      const isBelow = state.ebit < ind.ebit;

      container.innerHTML = `
        <div class="indiff-callout">
          <div class="quote-box">
            “At an EBIT of <span class="highlight-math font-mono">${formatCurrency(ind.ebit, false)}</span>, both financing alternatives generate the same EPS of <span class="highlight-math font-mono">${formatCurrency(ind.eps)}</span>. This is the EBIT–EPS indifference point.”
          </div>

          <div class="decision-rules-grid">
            <div class="decision-card ${isAbove ? 'active-zone' : ''}">
              <div class="decision-card-head" style="color: var(--success-dark);">
                <span>📈 When Expected EBIT &gt; ${formatCurrency(ind.ebit, false)}</span>
                ${isAbove ? '<span class="zone-pill">Current EBIT Zone</span>' : ''}
              </div>
              <p>
                <strong>Choose ${ind.steeperPlan.name}!</strong> The firm's operating return exceeds the cost of debt. Financial leverage ("Trading on Equity") boosts earnings per share for common stockholders.
              </p>
            </div>

            <div class="decision-card ${isBelow ? 'active-zone' : ''}">
              <div class="decision-card-head" style="color: #1e40af;">
                <span>🛡️ When Expected EBIT &lt; ${formatCurrency(ind.ebit, false)}</span>
                ${isBelow ? '<span class="zone-pill">Current EBIT Zone</span>' : ''}
              </div>
              <p>
                <strong>Choose ${ind.flatterPlan.name}!</strong> At low operating profit, fixed debt interest severely burdens net income. The lower-debt / equity-heavy plan offers safer and higher EPS.
              </p>
            </div>
          </div>
        </div>

        <div class="derivation-card mt-3">
          <h4 style="font-weight: 700; font-size: 0.85rem;">Step-by-Step Mathematical Derivation</h4>
          <div class="math-row font-mono">
            <strong>Formula Equality:</strong> [(EBIT − I₁) × (1 − T) − PD₁] ÷ N₁ = [(EBIT − I₂) × (1 − T) − PD₂] ÷ N₂
          </div>
          <div class="math-row font-mono">
            <strong>Values:</strong> Plan 1 (I₁=${formatCurrency(getPlanMetrics(plan1, 0, state.taxRate).interestExpense, false)}, N₁=${formatShares(plan1.numberOfShares)}) vs Plan 2 (I₂=${formatCurrency(getPlanMetrics(plan2, 0, state.taxRate).interestExpense, false)}, N₂=${formatShares(plan2.numberOfShares)})
          </div>
          <div class="math-row font-mono" style="color: var(--success-dark); font-weight: 700;">
            <strong>Solved Indifference EBIT:</strong> ${formatCurrency(ind.ebit, false)} &rarr; Indifference EPS: ${formatCurrency(ind.eps)}
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card p-5" style="border-left: 4px solid var(--warning); background: #fffbeb;">
          <h4 style="color: #92400e; font-weight: 800;">No Indifference Point Exists (Parallel Lines)</h4>
          <p style="font-size: 0.8rem; color: #78350f; margin-top: 0.35rem;">
            Both plans have the exact same number of shares (${formatShares(plan1.numberOfShares)}). Because their slopes <strong>(1 − T) ÷ N</strong> are identical, their EBIT–EPS lines run parallel and never cross.
          </p>
        </div>
      `;
    }

    // Render multi-plan matrix
    const matrixBody = document.getElementById('indiff-matrix-body');
    if (!matrixBody) return;
    matrixBody.innerHTML = '';

    for (let i = 0; i < state.plans.length; i++) {
      for (let j = i + 1; j < state.plans.length; j++) {
        const res = calculateIndifference(state.plans[i], state.plans[j], state.taxRate);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${state.plans[i].name}</strong> vs <strong>${state.plans[j].name}</strong></td>
          <td class="text-right font-mono font-bold" style="color: var(--primary);">${res.hasPoint ? formatCurrency(res.ebit, false) : 'Parallel Lines'}</td>
          <td class="text-right font-mono">${res.hasPoint ? formatCurrency(res.eps) : '—'}</td>
          <td style="color: var(--success); font-weight: 600;">${res.hasPoint ? res.steeperPlan.name : '—'}</td>
          <td style="color: var(--blue); font-weight: 600;">${res.hasPoint ? res.flatterPlan.name : '—'}</td>
        `;
        matrixBody.appendChild(tr);
      }
    }
  }

  // --- 8. COMPARE VIEW RENDERING ---
  function renderCompareView() {
    document.getElementById('compare-ebit-val').textContent = formatCurrency(state.ebit, false);
    document.getElementById('compare-tax-val').textContent = `${state.taxRate}%`;

    const results = state.plans.map(p => getPlanMetrics(p, state.ebit, state.taxRate));

    // Render EPS bar chart
    drawEpsBarChart(results);

    // Render Donuts
    const donutsContainer = document.getElementById('donuts-container');
    if (donutsContainer) {
      donutsContainer.innerHTML = '';
      results.forEach(r => {
        const div = document.createElement('div');
        div.className = 'donut-card';
        div.innerHTML = `
          <div class="donut-card-title">${r.planName}</div>
          <div class="donut-canvas-wrap">
            <canvas id="donut-${r.planId}" width="110" height="110"></canvas>
            <div class="donut-center-text">
              <span class="donut-center-pct">${r.debtRatio.toFixed(0)}%</span>
              <span class="donut-center-lbl">Debt</span>
            </div>
          </div>
          <div style="font-size: 0.65rem; color: var(--slate-500);">${formatCurrency(r.totalCapital, false)}</div>
        `;
        donutsContainer.appendChild(div);

        setTimeout(() => {
          drawDonutChart(`donut-${r.planId}`, r.equityAmount, r.debtAmount, r.preferenceCapital);
        }, 10);
      });
    }

    // Render Detailed Statements
    const stContainer = document.getElementById('compare-statement-cards');
    if (stContainer) {
      stContainer.innerHTML = '';
      results.forEach(r => {
        const div = document.createElement('div');
        div.className = 'statement-card';
        div.innerHTML = `
          <div class="card-color-stripe" style="background-color: ${r.color};"></div>
          <div class="statement-card-body">
            <h4 style="font-weight: 800; font-size: 1rem;">${r.planName}</h4>
            <div class="statement-rows font-mono">
              <div class="statement-row"><span>Operating Profit (EBIT):</span><strong>${formatCurrency(r.ebit, false)}</strong></div>
              <div class="statement-row" style="color: var(--danger);"><span>Less: Interest (I):</span><span>− ${formatCurrency(r.interestExpense)}</span></div>
              <div class="statement-row border-top-bold"><span>Earnings Before Tax (EBT):</span><span>${formatCurrency(r.ebt)}</span></div>
              <div class="statement-row" style="color: var(--slate-500);"><span>Less: Tax (${r.taxRate}%):</span><span>− ${formatCurrency(r.taxAmount)}</span></div>
              <div class="statement-row border-top-bold"><span>Profit After Tax (PAT):</span><span>${formatCurrency(r.pat)}</span></div>
              ${r.preferenceDividend > 0 ? `<div class="statement-row" style="color: var(--purple);"><span>Less: Preference Div:</span><span>− ${formatCurrency(r.preferenceDividend)}</span></div>` : ''}
              <div class="statement-row border-top-bold" style="font-size: 0.8rem;"><span>Earnings for Equity:</span><span>${formatCurrency(r.earningsForEquity)}</span></div>
              <div class="statement-row"><span>Equity Shares:</span><span>${formatShares(r.numberOfShares)}</span></div>
              <div class="statement-row border-top-highlight"><span>Earnings Per Share (EPS):</span><span>${formatCurrency(r.eps)}</span></div>
            </div>
            <div class="ratio-grid">
              <div class="ratio-box"><span class="ratio-box-label">D/E Ratio</span><span class="ratio-box-val font-mono">${r.debtEquityRatio.toFixed(2)}x</span></div>
              <div class="ratio-box"><span class="ratio-box-label">Fin Break-Even</span><span class="ratio-box-val font-mono">${formatCurrency(r.financialBreakEvenEbit, false)}</span></div>
            </div>
          </div>
        `;
        stContainer.appendChild(div);
      });
    }
  }

  function drawEpsBarChart(results) {
    const canvas = document.getElementById('epsBarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 40;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxVal = Math.max(...results.map(r => r.eps), 1) * 1.25;

    // Y Axis
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';

    for (let i = 0; i <= 4; i++) {
      const yVal = (i / 4) * maxVal;
      const py = padT + plotH - (yVal / maxVal) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(w - padR, py);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(yVal), padL - 6, py + 3);
    }

    // Bars
    const barWidth = Math.min(50, (plotW / results.length) * 0.6);
    const gap = plotW / results.length;

    results.forEach((r, idx) => {
      const cx = padL + idx * gap + gap / 2;
      const barH = (Math.max(0, r.eps) / maxVal) * plotH;
      const py = padT + plotH - barH;

      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.roundRect(cx - barWidth / 2, py, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

      // Top value
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatCurrency(r.eps), cx, py - 6);

      // Label below
      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter, sans-serif';
      const label = r.planName.length > 12 ? r.planName.substring(0, 10) + '...' : r.planName;
      ctx.fillText(label, cx, padT + plotH + 16);
    });
  }

  function drawDonutChart(canvasId, equity, debt, pref) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = equity + debt + pref;
    if (total <= 0) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = 48;
    const innerR = 32;

    const data = [
      { val: equity, color: '#3b82f6' },
      { val: debt, color: '#10b981' },
      { val: pref, color: '#8b5cf6' }
    ].filter(d => d.val > 0);

    let start = -Math.PI / 2;

    data.forEach(slice => {
      const angle = (slice.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, start, start + angle);
      ctx.arc(cx, cy, innerR, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      start += angle;
    });
  }

  // --- 9. SENSITIVITY VIEW RENDERING ---
  function renderSensitivityView() {
    const sortedLevels = [...state.sensPoints].sort((a, b) => a - b);

    // Render Active Chips
    const chipsList = document.getElementById('sens-points-chips');
    if (chipsList) {
      chipsList.innerHTML = '';
      sortedLevels.forEach(val => {
        const chip = document.createElement('span');
        chip.className = 'chip-item font-mono';
        chip.innerHTML = `${formatCurrency(val, false)} <button class="chip-remove" data-val="${val}">&times;</button>`;
        chipsList.appendChild(chip);
      });
      chipsList.querySelectorAll('.chip-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const v = parseFloat(btn.getAttribute('data-val'));
          if (state.sensPoints.length <= 2) {
            alert('Keep at least 2 EBIT points for sensitivity comparison.');
            return;
          }
          state.sensPoints = state.sensPoints.filter(x => x !== v);
          renderSensitivityView();
        });
      });
    }

    // Render Table Header
    const thead = document.getElementById('sensitivity-thead');
    if (thead) {
      let ths = '<tr><th>EBIT Level</th>';
      state.plans.forEach(p => {
        ths += `<th class="text-right"><span class="cell-dot" style="background:${p.color};"></span> ${p.name}</th>`;
      });
      ths += '<th class="text-center font-bold">Best Alternative</th></tr>';
      thead.innerHTML = ths;
    }

    // Render Table Body
    const tbody = document.getElementById('sensitivity-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      sortedLevels.forEach(ebitVal => {
        let maxEps = -Infinity;
        let bestName = '';

        const epsList = state.plans.map(p => {
          const eps = getPlanMetrics(p, ebitVal, state.taxRate).eps;
          if (eps > maxEps) {
            maxEps = eps;
            bestName = p.name;
          }
          return { plan: p, eps };
        });

        const tr = document.createElement('tr');
        let rowHtml = `<td class="font-mono font-bold">${formatCurrency(ebitVal, false)}</td>`;

        epsList.forEach(item => {
          const isBest = item.eps === maxEps && maxEps > 0;
          rowHtml += `<td class="text-right font-mono"><span class="eps-pill ${isBest ? 'best' : ''}">${formatCurrency(item.eps)}</span></td>`;
        });

        rowHtml += `<td class="text-center"><span class="badge-mini" style="background: var(--primary-light); color: var(--primary); font-size: 0.75rem;">★ ${bestName}</span></td>`;
        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
      });
    }

    // Draw Sensitivity Chart
    drawSensitivityChart(sortedLevels);
  }

  function drawSensitivityChart(ebitLevels) {
    const canvas = document.getElementById('sensitivityCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const padL = 60;
    const padR = 25;
    const padT = 25;
    const padB = 40;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const minX = Math.min(...ebitLevels);
    const maxX = Math.max(...ebitLevels);

    let minY = 0;
    let maxY = 1;
    state.plans.forEach(p => {
      ebitLevels.forEach(ebit => {
        const eps = getPlanMetrics(p, ebit, state.taxRate).eps;
        minY = Math.min(minY, eps);
        maxY = Math.max(maxY, eps);
      });
    });
    maxY *= 1.15;

    const scaleX = val => padL + ((val - minX) / (maxX - minX || 1)) * plotW;
    const scaleY = val => padT + plotH - ((val - minY) / (maxY - minY || 1)) * plotH;

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';

    for (let i = 0; i <= 4; i++) {
      const yVal = minY + (i / 4) * (maxY - minY);
      const py = scaleY(yVal);
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(w - padR, py);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(yVal), padL - 6, py + 3);
    }

    // Plot Lines
    state.plans.forEach(plan => {
      ctx.strokeStyle = plan.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      ebitLevels.forEach((ebit, idx) => {
        const eps = getPlanMetrics(plan, ebit, state.taxRate).eps;
        const px = scaleX(ebit);
        const py = scaleY(eps);

        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Dots
      ebitLevels.forEach(ebit => {
        const eps = getPlanMetrics(plan, ebit, state.taxRate).eps;
        const px = scaleX(ebit);
        const py = scaleY(eps);
        ctx.fillStyle = plan.color;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  // --- 10. QUIZ RENDERING ---
  function renderQuiz() {
    const list = document.getElementById('quiz-questions-list');
    if (!list) return;
    list.innerHTML = '';

    QUIZ_DATA.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-q-card';

      let optsHtml = '';
      q.opts.forEach((opt, oIdx) => {
        const isSel = state.quizAnswers[q.id] === oIdx;
        let cls = 'quiz-opt-btn';
        if (state.quizSubmitted) {
          if (oIdx === q.ans) cls += ' correct';
          else if (isSel) cls += ' wrong';
        } else if (isSel) {
          cls += ' selected';
        }
        optsHtml += `<button type="button" class="${cls}" data-qid="${q.id}" data-oidx="${oIdx}">${opt}</button>`;
      });

      card.innerHTML = `
        <div class="quiz-q-title">${idx + 1}. ${q.q}</div>
        <div class="quiz-options-list">${optsHtml}</div>
        ${state.quizSubmitted ? `<div class="quiz-explanation"><strong>Explanation:</strong> ${q.exp}</div>` : ''}
      `;
      list.appendChild(card);
    });

    list.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.quizSubmitted) return;
        const qid = parseInt(btn.getAttribute('data-qid'));
        const oidx = parseInt(btn.getAttribute('data-oidx'));
        state.quizAnswers[qid] = oidx;
        renderQuiz();
      });
    });
  }

  // --- 11. HISTORY RENDERING ---
  function renderHistory() {
    const container = document.getElementById('history-items-container');
    const badge = document.getElementById('history-count-badge');
    if (badge) {
      if (state.history.length > 0) {
        badge.textContent = state.history.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (!container) return;
    container.innerHTML = '';

    if (state.history.length === 0) {
      container.innerHTML = '<div style="padding: 3rem 1rem; text-align: center; color: var(--slate-400);">No saved calculation scenarios yet. Click "Save Scenario" anytime to preserve your work.</div>';
      return;
    }

    state.history.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-card';
      const dateStr = new Date(item.timestamp).toLocaleString();

      div.innerHTML = `
        <div class="history-card-header">
          <div>
            <div class="history-card-title">${item.name}</div>
            <div class="history-card-meta">Saved on ${dateStr} • ${item.plans.length} Financing Plans</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary load-hist-btn" data-id="${item.id}">Restore Scenario</button>
            <button class="btn btn-danger delete-hist-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
        <div class="ratio-labels font-mono">
          <span>EBIT: <strong>${formatCurrency(item.ebit, false)}</strong></span>
          <span>Tax: <strong>${item.taxRate}%</strong></span>
        </div>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('.load-hist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = state.history.find(x => x.id === btn.getAttribute('data-id'));
        if (it) {
          state.plans = JSON.parse(JSON.stringify(it.plans));
          state.ebit = it.ebit;
          state.taxRate = it.taxRate;
          state.currency = it.currency || state.currency;
          document.getElementById('ebit-input').value = state.ebit;
          document.getElementById('ebit-slider').value = state.ebit;
          document.getElementById('tax-input').value = state.taxRate;
          renderAll();
          switchTab('tab-ebit-eps');
          showToast(`Restored scenario "${it.name}"`);
        }
      });
    });

    container.querySelectorAll('.delete-hist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.history = state.history.filter(x => x.id !== btn.getAttribute('data-id'));
        renderHistory();
        persistState();
        showToast('Deleted calculation record.');
      });
    });
  }

  // --- 12. MODAL DIALOGS ---
  function openPlanModal(planId = null) {
    const modal = document.getElementById('modal-plan');
    const form = document.getElementById('form-plan');
    const title = document.getElementById('modal-plan-title');

    state.editingPlanId = planId;

    let plan = state.plans.find(p => p.id === planId);
    if (!plan) {
      // Default new plan
      plan = {
        id: `plan-${Date.now()}`,
        name: `Plan ${String.fromCharCode(65 + state.plans.length)}`,
        color: COLOR_PALETTE[state.plans.length % COLOR_PALETTE.length],
        debtAmount: 400000,
        interestRate: 10,
        equityAmount: 600000,
        sharePrice: 10,
        numberOfShares: 60000,
        preferenceCapital: 0,
        preferenceDividendRate: 9
      };
      title.textContent = 'Add New Financing Plan';
    } else {
      title.textContent = 'Edit Financing Plan';
    }

    document.getElementById('plan-id').value = plan.id;
    document.getElementById('plan-name').value = plan.name;
    document.getElementById('plan-color').value = plan.color;
    document.getElementById('plan-debt-amt').value = plan.debtAmount;
    document.getElementById('plan-interest-rate').value = plan.interestRate;
    document.getElementById('plan-equity-amt').value = plan.equityAmount;
    document.getElementById('plan-share-price').value = plan.sharePrice;
    document.getElementById('plan-shares-cnt').value = plan.numberOfShares;
    document.getElementById('plan-pref-amt').value = plan.preferenceCapital;
    document.getElementById('plan-pref-rate').value = plan.preferenceDividendRate;

    state.selectedPlanColor = plan.color;
    renderPalette();
    updatePlanPreviews();

    modal.classList.remove('hidden');
  }

  function renderPalette() {
    const wrap = document.getElementById('color-palette-picker');
    if (!wrap) return;
    wrap.innerHTML = '';
    COLOR_PALETTE.forEach(c => {
      const dot = document.createElement('div');
      dot.className = `palette-dot ${state.selectedPlanColor === c ? 'active' : ''}`;
      dot.style.backgroundColor = c;
      dot.addEventListener('click', () => {
        state.selectedPlanColor = c;
        document.getElementById('plan-color').value = c;
        renderPalette();
      });
      wrap.appendChild(dot);
    });
  }

  function updatePlanPreviews() {
    const debt = parseFloat(document.getElementById('plan-debt-amt').value) || 0;
    const rate = parseFloat(document.getElementById('plan-interest-rate').value) || 0;
    const eq = parseFloat(document.getElementById('plan-equity-amt').value) || 0;
    const pref = parseFloat(document.getElementById('plan-pref-amt').value) || 0;
    const prefRate = parseFloat(document.getElementById('plan-pref-rate').value) || 0;

    document.getElementById('plan-interest-preview').textContent = formatCurrency((debt * rate) / 100);
    document.getElementById('plan-pref-preview').textContent = formatCurrency((pref * prefRate) / 100);
    document.getElementById('plan-total-preview').textContent = formatCurrency(debt + eq + pref, false);
  }

  function closePlanModal() {
    document.getElementById('modal-plan').classList.add('hidden');
  }

  function duplicatePlan(planId) {
    const plan = state.plans.find(p => p.id === planId);
    if (!plan) return;
    const copy = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      color: COLOR_PALETTE[(state.plans.length + 1) % COLOR_PALETTE.length]
    };
    state.plans.push(copy);
    renderAll();
    showToast(`Duplicated "${plan.name}"`);
  }

  function deletePlan(planId) {
    if (state.plans.length <= 1) {
      alert('You must have at least one financing plan to analyze.');
      return;
    }
    state.plans = state.plans.filter(p => p.id !== planId);
    renderAll();
    showToast('Plan deleted.');
  }

  function openStepModal(planId) {
    const plan = state.plans.find(p => p.id === planId);
    if (!plan) return;
    const r = getPlanMetrics(plan, state.ebit, state.taxRate);

    document.getElementById('step-modal-title').textContent = `${r.planName} Breakdown`;
    const body = document.getElementById('step-modal-body');
    body.innerHTML = `
      <div class="ratio-labels p-2 bg-slate-50 rounded font-mono" style="font-size: 0.75rem;">
        <span>EBIT: <strong>${formatCurrency(r.ebit, false)}</strong></span>
        <span>Tax: <strong>${r.taxRate}%</strong></span>
        <span>Shares: <strong>${formatShares(r.numberOfShares)}</strong></span>
      </div>

      <div class="step-item">
        <div class="step-item-head">
          <span><span class="step-num-badge">1</span> Calculate Earnings Before Tax (EBT)</span>
          <span class="font-mono">EBT = EBIT − Interest</span>
        </div>
        <div class="step-math font-mono">
          EBT = ${formatCurrency(r.ebit, false)} − ${formatCurrency(r.interestExpense, false)} = <strong>${formatCurrency(r.ebt)}</strong>
        </div>
      </div>

      <div class="step-item">
        <div class="step-item-head">
          <span><span class="step-num-badge">2</span> Calculate Corporate Tax</span>
          <span class="font-mono">Tax = EBT × Tax Rate</span>
        </div>
        <div class="step-math font-mono">
          Tax = ${formatCurrency(r.ebt)} × ${r.taxRate}% = <strong>${formatCurrency(r.taxAmount)}</strong>
        </div>
      </div>

      <div class="step-item">
        <div class="step-item-head">
          <span><span class="step-num-badge">3</span> Calculate Profit After Tax (PAT)</span>
          <span class="font-mono">PAT = EBT − Tax</span>
        </div>
        <div class="step-math font-mono">
          PAT = ${formatCurrency(r.ebt)} − ${formatCurrency(r.taxAmount)} = <strong>${formatCurrency(r.pat)}</strong>
        </div>
      </div>

      <div class="step-item">
        <div class="step-item-head">
          <span><span class="step-num-badge">4</span> Earnings for Equity Shareholders (EAES)</span>
          <span class="font-mono">EAES = PAT − Preference Dividend</span>
        </div>
        <div class="step-math font-mono">
          EAES = ${formatCurrency(r.pat)} − ${formatCurrency(r.preferenceDividend)} = <strong>${formatCurrency(r.earningsForEquity)}</strong>
        </div>
      </div>

      <div class="step-item" style="border-color: var(--primary); background: var(--primary-light);">
        <div class="step-item-head" style="color: var(--primary);">
          <span><span class="step-num-badge" style="background: var(--primary);">5</span> Calculate Earnings Per Share (EPS)</span>
          <span class="font-mono">EPS = EAES ÷ Number of Shares</span>
        </div>
        <div class="step-math font-mono" style="font-size: 0.95rem; font-weight: 800; color: #1e1b4b;">
          EPS = ${formatCurrency(r.earningsForEquity)} ÷ ${formatShares(r.numberOfShares)} shares = <strong>${formatCurrency(r.eps)}</strong>
        </div>
      </div>

      <div class="ratio-grid mt-2">
        <div class="ratio-box">
          <span class="ratio-box-label">Financial Break-Even EBIT</span>
          <span class="ratio-box-val font-mono">${formatCurrency(r.financialBreakEvenEbit, false)}</span>
        </div>
        <div class="ratio-box">
          <span class="ratio-box-label">Degree of Financial Leverage (DFL)</span>
          <span class="ratio-box-val font-mono">${r.degreeOfFinancialLeverage ? r.degreeOfFinancialLeverage.toFixed(2) + 'x' : 'N/A'}</span>
        </div>
      </div>
    `;

    document.getElementById('modal-step').classList.remove('hidden');
  }

  function closeStepModal() {
    document.getElementById('modal-step').classList.add('hidden');
  }

  function switchTab(targetId) {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === targetId);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === targetId);
    });

    if (targetId === 'tab-ebit-eps') setTimeout(drawEbitEpsChart, 10);
    if (targetId === 'tab-compare') setTimeout(renderCompareView, 10);
    if (targetId === 'tab-sensitivity') setTimeout(() => drawSensitivityChart([...state.sensPoints].sort((a,b)=>a-b)), 10);
  }

  // --- 13. EVENT LISTENERS SETUP ---
  function initEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
    });

    // Learning Sub-tabs
    document.querySelectorAll('.sub-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-sub')).classList.add('active');
      });
    });

    // Currency Switcher
    document.querySelectorAll('.curr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currency = btn.getAttribute('data-currency');
        renderAll();
      });
    });

    // Presets Dropdown
    document.getElementById('preset-selector').addEventListener('change', e => {
      const preset = PRESETS[e.target.value];
      if (preset) {
        state.plans = JSON.parse(JSON.stringify(preset.plans));
        state.ebit = preset.ebit;
        state.taxRate = preset.taxRate;
        document.getElementById('ebit-input').value = state.ebit;
        document.getElementById('ebit-slider').value = state.ebit;
        document.getElementById('tax-input').value = state.taxRate;
        renderAll();
        showToast(`Loaded preset: "${preset.name}"`);
      }
      e.target.value = '';
    });

    // Reset Button
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('Reset to default textbook case?')) {
        const preset = PRESETS.classic;
        state.plans = JSON.parse(JSON.stringify(preset.plans));
        state.ebit = preset.ebit;
        state.taxRate = preset.taxRate;
        document.getElementById('ebit-input').value = state.ebit;
        document.getElementById('ebit-slider').value = state.ebit;
        document.getElementById('tax-input').value = state.taxRate;
        renderAll();
        showToast('Reset to default classic case.');
      }
    });

    // Save Scenario
    document.getElementById('btn-save-scenario').addEventListener('click', () => {
      const name = prompt('Enter a name for this scenario:', `Analysis ${new Date().toLocaleDateString()}`);
      if (!name) return;
      state.history.unshift({
        id: `hist-${Date.now()}`,
        timestamp: Date.now(),
        name: name.trim(),
        ebit: state.ebit,
        taxRate: state.taxRate,
        currency: state.currency,
        plans: JSON.parse(JSON.stringify(state.plans))
      });
      renderHistory();
      persistState();
      showToast(`Saved scenario "${name}"`);
    });

    // EBIT Input & Slider
    const ebitInp = document.getElementById('ebit-input');
    const ebitSlide = document.getElementById('ebit-slider');

    ebitInp.addEventListener('input', e => {
      state.ebit = Math.max(0, parseFloat(e.target.value) || 0);
      ebitSlide.value = state.ebit;
      ebitSlide.max = Math.max(500000, state.ebit * 2);
      renderAll();
    });

    ebitSlide.addEventListener('input', e => {
      state.ebit = parseFloat(e.target.value) || 0;
      ebitInp.value = state.ebit;
      renderAll();
    });

    // Stepper buttons
    document.querySelectorAll('.step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-delta'));
        state.ebit = Math.max(0, state.ebit + delta);
        ebitInp.value = state.ebit;
        ebitSlide.value = state.ebit;
        ebitSlide.max = Math.max(500000, state.ebit * 2);
        renderAll();
      });
    });

    // Tax Input & Presets
    const taxInp = document.getElementById('tax-input');
    taxInp.addEventListener('input', e => {
      state.taxRate = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
      document.querySelectorAll('.tax-preset-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.getAttribute('data-tax')) === state.taxRate);
      });
      renderAll();
    });

    document.querySelectorAll('.tax-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.taxRate = parseFloat(btn.getAttribute('data-tax'));
        taxInp.value = state.taxRate;
        document.querySelectorAll('.tax-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAll();
      });
    });

    // Chart Markers Toggles
    document.getElementById('toggle-indiff-markers').addEventListener('change', e => {
      state.showIndiffMarkers = e.target.checked;
      drawEbitEpsChart();
    });

    document.getElementById('toggle-bep-markers').addEventListener('change', e => {
      state.showBepMarkers = e.target.checked;
      drawEbitEpsChart();
    });

    // Plan Selectors for Indifference
    document.getElementById('indiff-plan1-select').addEventListener('change', renderIndifferenceView);
    document.getElementById('indiff-plan2-select').addEventListener('change', renderIndifferenceView);

    // Modal Events
    document.getElementById('btn-add-plan').addEventListener('click', () => openPlanModal());
    document.getElementById('btn-close-plan-modal').addEventListener('click', closePlanModal);
    document.getElementById('btn-cancel-plan').addEventListener('click', closePlanModal);
    document.getElementById('btn-close-step-modal').addEventListener('click', closeStepModal);
    document.getElementById('btn-done-step').addEventListener('click', closeStepModal);

    // Live preview inputs in modal
    ['plan-debt-amt', 'plan-interest-rate', 'plan-equity-amt', 'plan-share-price', 'plan-pref-amt', 'plan-pref-rate'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        if (id === 'plan-equity-amt' || id === 'plan-share-price') {
          const eq = parseFloat(document.getElementById('plan-equity-amt').value) || 0;
          const price = parseFloat(document.getElementById('plan-share-price').value) || 10;
          document.getElementById('plan-shares-cnt').value = Math.round(eq / price);
        }
        updatePlanPreviews();
      });
    });

    // Submit Plan Form
    document.getElementById('form-plan').addEventListener('submit', e => {
      e.preventDefault();
      const planName = document.getElementById('plan-name').value.trim();
      const debt = parseFloat(document.getElementById('plan-debt-amt').value) || 0;
      const rate = parseFloat(document.getElementById('plan-interest-rate').value) || 0;
      const eq = parseFloat(document.getElementById('plan-equity-amt').value) || 0;
      const price = parseFloat(document.getElementById('plan-share-price').value) || 10;
      const shares = parseInt(document.getElementById('plan-shares-cnt').value) || 1;
      const pref = parseFloat(document.getElementById('plan-pref-amt').value) || 0;
      const prefRate = parseFloat(document.getElementById('plan-pref-rate').value) || 0;
      const color = document.getElementById('plan-color').value;

      if (!planName) { alert('Plan name is required'); return; }
      if (shares <= 0) { alert('Number of shares must be > 0'); return; }
      if (debt + eq + pref <= 0) { alert('Total capital must be > 0'); return; }

      if (state.editingPlanId) {
        state.plans = state.plans.map(p => p.id === state.editingPlanId ? {
          ...p,
          name: planName,
          debtAmount: debt,
          interestRate: rate,
          equityAmount: eq,
          sharePrice: price,
          numberOfShares: shares,
          preferenceCapital: pref,
          preferenceDividendRate: prefRate,
          color
        } : p);
      } else {
        state.plans.push({
          id: `plan-${Date.now()}`,
          name: planName,
          debtAmount: debt,
          interestRate: rate,
          equityAmount: eq,
          sharePrice: price,
          numberOfShares: shares,
          preferenceCapital: pref,
          preferenceDividendRate: prefRate,
          color
        });
      }

      closePlanModal();
      renderAll();
      showToast('Plan saved successfully!');
    });

    // Sensitivity Point Add
    document.getElementById('form-add-sens-point').addEventListener('submit', e => {
      e.preventDefault();
      const inp = document.getElementById('input-new-sens');
      const val = parseFloat(inp.value);
      if (!isNaN(val) && val >= 0 && !state.sensPoints.includes(val)) {
        state.sensPoints.push(val);
        inp.value = '';
        renderSensitivityView();
      }
    });

    document.getElementById('btn-sens-default').addEventListener('click', () => {
      state.sensPoints = [50000, 75000, 100000, 125000, 150000];
      renderSensitivityView();
    });

    document.getElementById('btn-sens-100k').addEventListener('click', () => {
      state.sensPoints = [100000, 150000, 200000, 250000, 300000];
      renderSensitivityView();
    });

    document.getElementById('btn-sens-200k').addEventListener('click', () => {
      state.sensPoints = [200000, 300000, 400000, 500000, 600000];
      renderSensitivityView();
    });

    // Quiz Submit & Retry
    document.getElementById('btn-submit-quiz').addEventListener('click', () => {
      state.quizSubmitted = true;
      let score = 0;
      QUIZ_DATA.forEach(q => {
        if (state.quizAnswers[q.id] === q.ans) score++;
      });
      const badge = document.getElementById('quiz-score-badge');
      badge.textContent = `Score: ${score} / ${QUIZ_DATA.length}`;
      badge.classList.remove('hidden');
      document.getElementById('btn-submit-quiz').classList.add('hidden');
      document.getElementById('btn-reset-quiz').classList.remove('hidden');
      renderQuiz();
    });

    document.getElementById('btn-reset-quiz').addEventListener('click', () => {
      state.quizSubmitted = false;
      state.quizAnswers = {};
      document.getElementById('quiz-score-badge').classList.add('hidden');
      document.getElementById('btn-submit-quiz').classList.remove('hidden');
      document.getElementById('btn-reset-quiz').classList.add('hidden');
      renderQuiz();
    });

    // Export CSV
    document.getElementById('btn-export-csv').addEventListener('click', () => {
      if (state.history.length === 0) {
        alert('No calculation history to export.');
        return;
      }
      let csv = 'Timestamp,Scenario Name,EBIT,Tax Rate,Plan Name,EPS,Interest,Debt-Equity Ratio\n';
      state.history.forEach(h => {
        const d = new Date(h.timestamp).toISOString();
        h.plans.forEach(p => {
          const m = getPlanMetrics(p, h.ebit, h.taxRate);
          csv += `"${d}","${h.name}",${h.ebit},${h.taxRate},"${p.name}",${m.eps.toFixed(2)},${m.interestExpense.toFixed(2)},${m.debtEquityRatio.toFixed(2)}\n`;
        });
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `capital_structure_export_${Date.now()}.csv`;
      a.click();
    });

    // Print Report
    document.getElementById('btn-print-report').addEventListener('click', () => {
      window.print();
    });

    // Clear History
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      if (confirm('Clear all saved calculation history?')) {
        state.history = [];
        renderHistory();
        persistState();
        showToast('All history cleared.');
      }
    });

    // Window resize chart re-render
    window.addEventListener('resize', () => {
      drawEbitEpsChart();
      drawSensitivityChart([...state.sensPoints].sort((a,b)=>a-b));
    });
  }

  // --- 14. INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    renderAll();
  });
})();
