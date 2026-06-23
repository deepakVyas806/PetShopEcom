/**
 * ─── Central Currency Configuration ───────────────────────────────────────────
 *
 * To switch the entire app to a different currency, change ONLY this object:
 *
 *   USD  →  symbol: "$",  locale: "en-US", rate: 1
 *   INR  →  symbol: "₹",  locale: "en-IN", rate: 83
 *   EUR  →  symbol: "€",  locale: "de-DE", rate: 0.92
 *
 * `rate` is the multiplier applied to base prices stored in the codebase (USD).
 * Set rate: 1 when data is already in the target currency.
 */
export const CURRENCY = {
  symbol:  "₹",
  code:    "INR",
  locale:  "en-IN",
  rate:    1,         // prices stored in INR — no conversion needed
} as const;

/**
 * Format a numeric price value into the configured currency string.
 *
 * @example
 *   fmt(9.99)   // "₹829"
 *   fmt(0)      // "₹0"
 */
export function fmt(amount: number): string {
  const converted = Math.round(amount * CURRENCY.rate);
  return `${CURRENCY.symbol}${converted.toLocaleString(CURRENCY.locale)}`;
}

/**
 * Format with decimal places (use sparingly — only when cents matter, e.g. totals).
 */
export function fmtDecimal(amount: number): string {
  const converted = (amount * CURRENCY.rate).toFixed(2);
  return `${CURRENCY.symbol}${Number(converted).toLocaleString(CURRENCY.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
