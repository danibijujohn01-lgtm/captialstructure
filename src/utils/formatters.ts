import type { CurrencyCode, CurrencyConfig } from '../types/finance';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    locale: 'en-GB',
  },
};

/**
 * Format a number as currency with 2 decimal places.
 */
export function formatCurrency(
  value: number | null | undefined,
  currencyCode: CurrencyCode = 'INR',
  showDecimals: boolean = true
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `${CURRENCIES[currencyCode].symbol}0.00`;
  }

  const config = CURRENCIES[currencyCode];
  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(value);

    return `${config.symbol}${formatted}`;
  } catch {
    return `${config.symbol}${value.toFixed(showDecimals ? 2 : 0)}`;
  }
}

/**
 * Format compact currency for chart axes, e.g. ₹50k, ₹10L, $100K
 */
export function formatCompactCurrency(
  value: number,
  currencyCode: CurrencyCode = 'INR'
): string {
  if (isNaN(value)) return '0';
  const symbol = CURRENCIES[currencyCode].symbol;
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (currencyCode === 'INR') {
    if (abs >= 10000000) {
      return `${sign}${symbol}${(abs / 10000000).toFixed(1)} Cr`;
    }
    if (abs >= 100000) {
      return `${sign}${symbol}${(abs / 100000).toFixed(1)} L`;
    }
    if (abs >= 1000) {
      return `${sign}${symbol}${(abs / 1000).toFixed(0)}k`;
    }
    return `${sign}${symbol}${abs.toFixed(0)}`;
  }

  // International formatting
  if (abs >= 1000000000) {
    return `${sign}${symbol}${(abs / 1000000000).toFixed(1)}B`;
  }
  if (abs >= 1000000) {
    return `${sign}${symbol}${(abs / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${sign}${symbol}${(abs / 1000).toFixed(0)}k`;
  }
  return `${sign}${symbol}${abs.toFixed(0)}`;
}

/**
 * Format percentage with 1 or 2 decimals
 */
export function formatPercent(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format simple decimal ratio (e.g. 1.25x or 0.50)
 */
export function formatRatio(value: number | null | undefined, suffix: string = 'x'): string {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  if (!isFinite(value)) return 'Infinite';
  return `${value.toFixed(2)}${suffix}`;
}

/**
 * Format share count with locale thousands separators
 */
export function formatShares(value: number, locale: string = 'en-IN'): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value));
}
