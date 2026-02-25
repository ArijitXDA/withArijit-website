// =====================================================
// Currency Formatting & Conversion Utilities
// =====================================================

import type { CurrencyCode, PricingRule } from '../types/course';
import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES } from './constants';

/**
 * Format a number as currency string
 * @example formatCurrency(7999, 'INR') => "₹7,999"
 * @example formatCurrency(95.99, 'USD') => "$95.99"
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  // Use locale-aware number formatting
  const formatted = new Intl.NumberFormat(getLocaleForCurrency(currency), {
    minimumFractionDigits: hasDecimalCurrency(currency) ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formatted}`;
}

/**
 * Format price with both INR and local currency
 * @example formatDualCurrency(7999, 95.99, 'USD') => "₹7,999 (~$96)"
 */
export function formatDualCurrency(
  inrAmount: number,
  localAmount: number,
  localCurrency: CurrencyCode
): string {
  if (localCurrency === 'INR') {
    return formatCurrency(inrAmount, 'INR');
  }

  const inrStr = formatCurrency(inrAmount, 'INR');
  const localStr = formatCurrency(Math.round(localAmount), localCurrency);

  return `${inrStr} (~${localStr})`;
}

/**
 * Format monthly price with period suffix
 * @example formatMonthlyPrice(7999, 'INR') => "₹7,999/mo"
 */
export function formatMonthlyPrice(amount: number, currency: CurrencyCode): string {
  return `${formatCurrency(amount, currency)}/mo`;
}

/**
 * Get the local currency pricing for a course
 * Falls back to INR if no matching currency found
 */
export function getLocalPricing(
  pricingRules: PricingRule[],
  currency: CurrencyCode
): PricingRule | undefined {
  return (
    pricingRules.find((p) => p.currency_code === currency) ||
    pricingRules.find((p) => p.currency_code === 'INR')
  );
}

/**
 * Convert INR amount to local currency
 */
export function convertFromINR(
  amountINR: number,
  exchangeRate: number
): number {
  return Math.round(amountINR * exchangeRate * 100) / 100;
}

/**
 * Check if a currency code is supported
 */
export function isSupportedCurrency(code: string): code is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(code as CurrencyCode);
}

// =====================================================
// Internal Helpers
// =====================================================

function getLocaleForCurrency(currency: CurrencyCode): string {
  const localeMap: Record<CurrencyCode, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    SGD: 'en-SG',
    AED: 'ar-AE',
  };
  return localeMap[currency] || 'en-US';
}

function hasDecimalCurrency(currency: CurrencyCode): boolean {
  // INR typically shown without decimals for whole amounts
  return currency !== 'INR';
}
