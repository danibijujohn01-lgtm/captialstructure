import type {
  FinancingPlan,
  PlanCalculationResult,
  IndifferenceResult,
  SensitivityPoint,
} from '../types/finance';

/**
 * Get the effective interest expense for a plan.
 */
export function getInterestExpense(plan: FinancingPlan): number {
  if (plan.directInterest !== undefined && plan.directInterest !== null && plan.directInterest > 0) {
    return plan.directInterest;
  }
  return (plan.debtAmount * plan.interestRate) / 100;
}

/**
 * Get effective preference dividend for a plan.
 */
export function getPreferenceDividend(plan: FinancingPlan): number {
  if (
    plan.directPreferenceDividend !== undefined &&
    plan.directPreferenceDividend !== null &&
    plan.directPreferenceDividend > 0
  ) {
    return plan.directPreferenceDividend;
  }
  return (plan.preferenceCapital * plan.preferenceDividendRate) / 100;
}

/**
 * Get effective number of equity shares.
 */
export function getEffectiveShares(plan: FinancingPlan): number {
  if (plan.numberOfShares && plan.numberOfShares > 0) {
    return plan.numberOfShares;
  }
  if (plan.sharePrice && plan.sharePrice > 0 && plan.equityAmount > 0) {
    return plan.equityAmount / plan.sharePrice;
  }
  return 1; // Fallback to avoid division by zero
}

/**
 * Calculate all financial metrics for a given plan at a specific EBIT and tax rate.
 */
export function calculatePlanMetrics(
  plan: FinancingPlan,
  ebit: number,
  taxRatePercent: number
): PlanCalculationResult {
  const taxRate = Math.max(0, Math.min(100, taxRatePercent)) / 100;
  const interest = getInterestExpense(plan);
  const prefDiv = getPreferenceDividend(plan);
  const shares = getEffectiveShares(plan);

  const ebt = ebit - interest;
  const taxAmount = ebt * taxRate;
  const pat = ebt - taxAmount; // EAT
  const earningsForEquity = pat - prefDiv;
  const eps = earningsForEquity / shares;

  const totalCapital = plan.debtAmount + plan.equityAmount + plan.preferenceCapital;
  const debtRatio = totalCapital > 0 ? (plan.debtAmount / totalCapital) * 100 : 0;
  const equityRatio = totalCapital > 0 ? (plan.equityAmount / totalCapital) * 100 : 0;
  const prefRatio = totalCapital > 0 ? (plan.preferenceCapital / totalCapital) * 100 : 0;
  const debtEquityRatio = plan.equityAmount > 0 ? plan.debtAmount / plan.equityAmount : 0;

  // Financial Break-Even Point (where EPS = 0)
  // (EBIT - I)(1 - T) - PD = 0  =>  EBIT = I + PD / (1 - T)
  const taxMultiplier = 1 - taxRate;
  const financialBreakEvenEbit =
    taxMultiplier > 0 ? interest + prefDiv / taxMultiplier : interest + prefDiv;

  // Degree of Financial Leverage (DFL) = EBIT / [EBIT - I - PD / (1 - T)]
  const dflDenominator = ebit - financialBreakEvenEbit;
  const degreeOfFinancialLeverage =
    Math.abs(dflDenominator) > 0.0001 ? ebit / dflDenominator : null;

  // Interest Coverage Ratio (ICR) = EBIT / Interest
  const interestCoverageRatio = interest > 0 ? ebit / interest : null;

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
    preferenceRatio: prefRatio,
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
    degreeOfFinancialLeverage,
    interestCoverageRatio,
  };
}

/**
 * Calculate the Break-Even EBIT / Indifference Point between two financing plans.
 *
 * Formula:
 * [(EBIT - I1)(1 - T) - PD1] / N1 = [(EBIT - I2)(1 - T) - PD2] / N2
 *
 * EBIT* = { N2 * [I1*(1-T) + PD1] - N1 * [I2*(1-T) + PD2] } / [ (N2 - N1) * (1-T) ]
 */
export function calculateIndifferencePoint(
  plan1: FinancingPlan,
  plan2: FinancingPlan,
  taxRatePercent: number
): IndifferenceResult {
  const taxRate = Math.max(0, Math.min(100, taxRatePercent)) / 100;
  const t = 1 - taxRate;

  const I1 = getInterestExpense(plan1);
  const I2 = getInterestExpense(plan2);
  const PD1 = getPreferenceDividend(plan1);
  const PD2 = getPreferenceDividend(plan2);
  const N1 = getEffectiveShares(plan1);
  const N2 = getEffectiveShares(plan2);

  // Check for identical share count (parallel lines)
  if (Math.abs(N1 - N2) < 0.0001) {
    const fixedCharges1 = I1 * t + PD1;
    const fixedCharges2 = I2 * t + PD2;

    if (Math.abs(fixedCharges1 - fixedCharges2) < 0.0001) {
      return {
        plan1,
        plan2,
        indifferenceEbit: null,
        indifferenceEps: null,
        hasIndifferencePoint: true,
        isParallel: true,
        statusMessage: `Both plans have identical EPS at all EBIT levels because they have the same number of shares (${N1.toLocaleString()}) and equivalent fixed financial obligations.`,
        recommendation: null,
      };
    }

    const betterPlan = fixedCharges1 < fixedCharges2 ? plan1 : plan2;
    const higherBurdenPlan = fixedCharges1 < fixedCharges2 ? plan2 : plan1;

    return {
      plan1,
      plan2,
      indifferenceEbit: null,
      indifferenceEps: null,
      hasIndifferencePoint: false,
      isParallel: true,
      statusMessage: `No indifference point exists. Both plans have the same number of shares (${N1.toLocaleString()}), meaning their EBIT-EPS lines are strictly parallel. '${betterPlan.name}' strictly dominates '${higherBurdenPlan.name}' at every EBIT level due to lower fixed charges.`,
      recommendation: null,
    };
  }

  // Calculate numerator & denominator
  // Fixed burden for Plan 1 = I1*(1-T) + PD1
  // Fixed burden for Plan 2 = I2*(1-T) + PD2
  const burden1 = I1 * t + PD1;
  const burden2 = I2 * t + PD2;

  const numerator = N2 * burden1 - N1 * burden2;
  const denominator = (N2 - N1) * t;

  if (Math.abs(denominator) < 0.00001) {
    return {
      plan1,
      plan2,
      indifferenceEbit: null,
      indifferenceEps: null,
      hasIndifferencePoint: false,
      isParallel: false,
      statusMessage: 'Unable to calculate indifference point (tax rate is 100% or invalid).',
      recommendation: null,
    };
  }

  const indifferenceEbit = numerator / denominator;

  // Calculate EPS at indifference EBIT using Plan 1
  const indifferenceEps = ((indifferenceEbit - I1) * t - PD1) / N1;

  // Determine which plan has higher leverage (higher fixed burden & fewer shares)
  // The plan with fewer shares has a steeper slope (t / N)
  const steeperPlan = N1 < N2 ? plan1 : plan2; // higher leverage / fewer shares
  const flatterPlan = N1 < N2 ? plan2 : plan1; // lower leverage / more shares

  return {
    plan1,
    plan2,
    indifferenceEbit,
    indifferenceEps,
    hasIndifferencePoint: true,
    isParallel: false,
    statusMessage: `At an EBIT of ${indifferenceEbit.toFixed(2)}, both '${plan1.name}' and '${plan2.name}' yield the same EPS of ${indifferenceEps.toFixed(2)}.`,
    recommendation: {
      aboveEbitPlan: steeperPlan.name,
      belowEbitPlan: flatterPlan.name,
      explanation: `When EBIT exceeds ${indifferenceEbit.toFixed(2)}, '${steeperPlan.name}' delivers higher EPS due to favorable financial leverage ("Trading on Equity"). Conversely, when EBIT is below ${indifferenceEbit.toFixed(2)}, '${flatterPlan.name}' is preferable because it has lower fixed financial risk.`,
    },
  };
}

/**
 * Calculate all pairwise indifference points among a list of plans.
 */
export function calculateAllIndifferencePoints(
  plans: FinancingPlan[],
  taxRatePercent: number
): IndifferenceResult[] {
  const results: IndifferenceResult[] = [];
  for (let i = 0; i < plans.length; i++) {
    for (let j = i + 1; j < plans.length; j++) {
      results.push(calculateIndifferencePoint(plans[i], plans[j], taxRatePercent));
    }
  }
  return results;
}

/**
 * Calculate sensitivity matrix for a list of EBIT levels.
 */
export function calculateSensitivity(
  plans: FinancingPlan[],
  ebitLevels: number[],
  taxRatePercent: number
): SensitivityPoint[] {
  return ebitLevels.map((ebit) => {
    const point: SensitivityPoint = {
      ebit,
      bestPlanId: '',
      bestPlanName: '',
      maxEps: -Infinity,
    };

    plans.forEach((plan) => {
      const metrics = calculatePlanMetrics(plan, ebit, taxRatePercent);
      point[plan.id] = metrics.eps;

      if (metrics.eps > point.maxEps) {
        point.maxEps = metrics.eps;
        point.bestPlanId = plan.id;
        point.bestPlanName = plan.name;
      }
    });

    return point;
  });
}

/**
 * Generate a smart EBIT range for graphing that encompasses:
 * 0, financial break-even points, indifference points, and selected expected EBIT.
 */
export function generateEbitGraphData(
  plans: FinancingPlan[],
  expectedEbit: number,
  taxRatePercent: number,
  steps: number = 40
): {
  data: Array<{ ebit: number; [planName: string]: number }>;
  minEbit: number;
  maxEbit: number;
  indifferencePoints: Array<{ ebit: number; eps: number; label: string }>;
  breakEvenPoints: Array<{ ebit: number; planName: string; color: string }>;
} {
  // Collect all critical EBIT values
  const breakEvenPoints: Array<{ ebit: number; planName: string; color: string }> = [];
  const indifferencePoints: Array<{ ebit: number; eps: number; label: string }> = [];

  plans.forEach((p) => {
    const m = calculatePlanMetrics(p, expectedEbit, taxRatePercent);
    if (m.financialBreakEvenEbit >= 0) {
      breakEvenPoints.push({
        ebit: m.financialBreakEvenEbit,
        planName: p.name,
        color: p.color,
      });
    }
  });

  const allIndiff = calculateAllIndifferencePoints(plans, taxRatePercent);
  allIndiff.forEach((res) => {
    if (res.hasIndifferencePoint && res.indifferenceEbit !== null && res.indifferenceEps !== null) {
      indifferencePoints.push({
        ebit: res.indifferenceEbit,
        eps: res.indifferenceEps,
        label: `${res.plan1.name} = ${res.plan2.name}`,
      });
    }
  });

  // Determine span
  const candidateEbits = [
    0,
    expectedEbit,
    expectedEbit * 1.5,
    ...breakEvenPoints.map((b) => b.ebit),
    ...indifferencePoints.map((ip) => ip.ebit).filter((e) => e > 0 && e < expectedEbit * 4),
  ];

  const minEbit = 0;
  const maxEbit = Math.max(...candidateEbits, expectedEbit * 1.5, 100000) * 1.2;

  // Generate uniform points
  const data: Array<{ ebit: number; [planName: string]: number }> = [];
  const stepSize = (maxEbit - minEbit) / steps;

  // Also include exact critical points to ensure graph crosses precisely
  const sortedEbitValues = new Set<number>();
  for (let i = 0; i <= steps; i++) {
    sortedEbitValues.add(Math.round(minEbit + i * stepSize));
  }
  sortedEbitValues.add(expectedEbit);
  breakEvenPoints.forEach((b) => sortedEbitValues.add(Math.round(b.ebit)));
  indifferencePoints.forEach((ip) => {
    if (ip.ebit >= minEbit && ip.ebit <= maxEbit) {
      sortedEbitValues.add(Math.round(ip.ebit));
    }
  });

  const sortedArray = Array.from(sortedEbitValues).sort((a, b) => a - b);

  sortedArray.forEach((ebit) => {
    const row: { ebit: number; [planName: string]: number } = { ebit };
    plans.forEach((plan) => {
      const metrics = calculatePlanMetrics(plan, ebit, taxRatePercent);
      row[plan.name] = Number(metrics.eps.toFixed(3));
    });
    data.push(row);
  });

  return {
    data,
    minEbit,
    maxEbit,
    indifferencePoints,
    breakEvenPoints,
  };
}
