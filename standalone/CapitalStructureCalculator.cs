using System;
using System.Collections.Generic;
using System.Linq;

namespace CapitalStructureAnalysis
{
    /// <summary>
    /// Represents a corporate financing plan with debt, equity, and preference share components.
    /// </summary>
    public class FinancingPlan
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public decimal DebtAmount { get; set; }
        public decimal InterestRatePercent { get; set; }
        public decimal? DirectInterest { get; set; }

        public decimal EquityAmount { get; set; }
        public decimal SharePrice { get; set; } = 10m;
        public decimal NumberOfShares { get; set; }

        public decimal PreferenceCapital { get; set; }
        public decimal PreferenceDividendRatePercent { get; set; }
        public decimal? DirectPreferenceDividend { get; set; }

        public decimal TotalCapital => DebtAmount + EquityAmount + PreferenceCapital;

        public decimal AnnualInterest =>
            DirectInterest ?? (DebtAmount * (InterestRatePercent / 100m));

        public decimal AnnualPreferenceDividend =>
            DirectPreferenceDividend ?? (PreferenceCapital * (PreferenceDividendRatePercent / 100m));

        public decimal EffectiveShares =>
            NumberOfShares > 0 ? NumberOfShares : (SharePrice > 0 ? EquityAmount / SharePrice : 1m);
    }

    /// <summary>
    /// Result metrics for a financing plan at a specific EBIT level.
    /// </summary>
    public class PlanCalculationResult
    {
        public string PlanName { get; set; } = string.Empty;
        public decimal TotalCapital { get; set; }
        public decimal DebtAmount { get; set; }
        public decimal EquityAmount { get; set; }
        public decimal PreferenceCapital { get; set; }

        public decimal DebtRatioPercent { get; set; }
        public decimal EquityRatioPercent { get; set; }
        public decimal PreferenceRatioPercent { get; set; }
        public decimal DebtEquityRatio { get; set; }

        public decimal EBIT { get; set; }
        public decimal InterestExpense { get; set; }
        public decimal EBT { get; set; }
        public decimal TaxRatePercent { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal PAT { get; set; }
        public decimal PreferenceDividend { get; set; }
        public decimal EarningsForEquity { get; set; }
        public decimal NumberOfShares { get; set; }
        public decimal EPS { get; set; }

        public decimal FinancialBreakEvenEbit { get; set; }
        public decimal? DegreeOfFinancialLeverage { get; set; }
        public decimal? InterestCoverageRatio { get; set; }
    }

    /// <summary>
    /// Break-even EBIT / Indifference point analysis between two financing plans.
    /// </summary>
    public class IndifferenceResult
    {
        public string Plan1Name { get; set; } = string.Empty;
        public string Plan2Name { get; set; } = string.Empty;
        public bool HasIndifferencePoint { get; set; }
        public bool IsParallel { get; set; }
        public decimal? IndifferenceEbit { get; set; }
        public decimal? IndifferenceEps { get; set; }
        public string DominantAboveEbit { get; set; } = string.Empty;
        public string DominantBelowEbit { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
    }

    /// <summary>
    /// Core calculation engine for Capital Structure, EBIT-EPS, and Indifference Point analysis.
    /// </summary>
    public static class CapitalStructureCalculator
    {
        /// <summary>
        /// Calculates all income statement line items, EPS, and leverage metrics.
        /// Formula: EPS = [(EBIT - Interest) * (1 - TaxRate) - PreferenceDividend] / NumberOfShares
        /// </summary>
        public static PlanCalculationResult CalculateMetrics(FinancingPlan plan, decimal ebit, decimal taxRatePercent)
        {
            decimal taxRate = Math.Clamp(taxRatePercent, 0m, 100m) / 100m;
            decimal interest = plan.AnnualInterest;
            decimal prefDiv = plan.AnnualPreferenceDividend;
            decimal shares = plan.EffectiveShares;

            decimal ebt = ebit - interest;
            decimal taxAmount = ebt * taxRate;
            decimal pat = ebt - taxAmount;
            decimal earningsForEquity = pat - prefDiv;
            decimal eps = shares > 0 ? earningsForEquity / shares : 0m;

            decimal totalCapital = plan.TotalCapital;
            decimal debtRatio = totalCapital > 0 ? (plan.DebtAmount / totalCapital) * 100m : 0m;
            decimal eqRatio = totalCapital > 0 ? (plan.EquityAmount / totalCapital) * 100m : 0m;
            decimal prefRatio = totalCapital > 0 ? (plan.PreferenceCapital / totalCapital) * 100m : 0m;
            decimal deRatio = plan.EquityAmount > 0 ? plan.DebtAmount / plan.EquityAmount : 0m;

            // Financial Break-Even EBIT: EBIT where EPS = 0 => EBIT = Interest + PreferenceDividend / (1 - TaxRate)
            decimal t = 1m - taxRate;
            decimal financialBreakEvenEbit = t > 0 ? interest + (prefDiv / t) : interest + prefDiv;

            // Degree of Financial Leverage (DFL) = EBIT / [EBIT - BreakEvenEBIT]
            decimal dflDenom = ebit - financialBreakEvenEbit;
            decimal? dfl = Math.Abs(dflDenom) > 0.0001m ? ebit / dflDenom : null;

            decimal? icr = interest > 0 ? ebit / interest : null;

            return new PlanCalculationResult
            {
                PlanName = plan.Name,
                TotalCapital = totalCapital,
                DebtAmount = plan.DebtAmount,
                EquityAmount = plan.EquityAmount,
                PreferenceCapital = plan.PreferenceCapital,
                DebtRatioPercent = debtRatio,
                EquityRatioPercent = eqRatio,
                PreferenceRatioPercent = prefRatio,
                DebtEquityRatio = deRatio,
                EBIT = ebit,
                InterestExpense = interest,
                EBT = ebt,
                TaxRatePercent = taxRatePercent,
                TaxAmount = taxAmount,
                PAT = pat,
                PreferenceDividend = prefDiv,
                EarningsForEquity = earningsForEquity,
                NumberOfShares = shares,
                EPS = eps,
                FinancialBreakEvenEbit = financialBreakEvenEbit,
                DegreeOfFinancialLeverage = dfl,
                InterestCoverageRatio = icr
            };
        }

        /// <summary>
        /// Solves for the Break-Even EBIT (Indifference Point) between two financing plans:
        /// [(EBIT - I1)*(1 - T) - PD1] / N1 = [(EBIT - I2)*(1 - T) - PD2] / N2
        /// </summary>
        public static IndifferenceResult CalculateIndifference(FinancingPlan plan1, FinancingPlan plan2, decimal taxRatePercent)
        {
            decimal taxRate = Math.Clamp(taxRatePercent, 0m, 100m) / 100m;
            decimal t = 1m - taxRate;

            decimal I1 = plan1.AnnualInterest;
            decimal I2 = plan2.AnnualInterest;
            decimal PD1 = plan1.AnnualPreferenceDividend;
            decimal PD2 = plan2.AnnualPreferenceDividend;
            decimal N1 = plan1.EffectiveShares;
            decimal N2 = plan2.EffectiveShares;

            // Check for parallel lines (equal number of shares)
            if (Math.Abs(N1 - N2) < 0.0001m)
            {
                return new IndifferenceResult
                {
                    Plan1Name = plan1.Name,
                    Plan2Name = plan2.Name,
                    HasIndifferencePoint = false,
                    IsParallel = true,
                    Explanation = $"Both plans issue the same number of shares ({N1:N0}). Slopes are identical; lines run parallel and never cross."
                };
            }

            decimal burden1 = (I1 * t) + PD1;
            decimal burden2 = (I2 * t) + PD2;

            decimal numerator = (N2 * burden1) - (N1 * burden2);
            decimal denominator = (N2 - N1) * t;

            if (Math.Abs(denominator) < 0.00001m)
            {
                return new IndifferenceResult
                {
                    Plan1Name = plan1.Name,
                    Plan2Name = plan2.Name,
                    HasIndifferencePoint = false,
                    Explanation = "Denominator is zero (100% tax rate or invalid configuration)."
                };
            }

            decimal indifferenceEbit = numerator / denominator;
            decimal indifferenceEps = ((indifferenceEbit - I1) * t - PD1) / N1;

            var steeperPlan = N1 < N2 ? plan1 : plan2;
            var flatterPlan = N1 < N2 ? plan2 : plan1;

            return new IndifferenceResult
            {
                Plan1Name = plan1.Name,
                Plan2Name = plan2.Name,
                HasIndifferencePoint = true,
                IsParallel = false,
                IndifferenceEbit = indifferenceEbit,
                IndifferenceEps = indifferenceEps,
                DominantAboveEbit = steeperPlan.Name,
                DominantBelowEbit = flatterPlan.Name,
                Explanation = $"At an EBIT of {indifferenceEbit:C2}, both alternatives generate the same EPS of {indifferenceEps:C2}."
            };
        }
    }
}
