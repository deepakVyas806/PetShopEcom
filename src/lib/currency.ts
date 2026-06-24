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

// Indian numbering format (groups of 2 after the first 3 from the right).
// Manual implementation avoids toLocaleString whose output differs between
// Node.js (server) and browsers when ICU data isn't bundled — that mismatch
// causes React hydration errors.
function inrGroup(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "0";
  const neg = n < 0;
  const s   = Math.abs(Math.round(n)).toString();
  if (s.length <= 3) return (neg ? "-" : "") + s;
  const last3  = s.slice(-3);
  const rest   = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (neg ? "-" : "") + grouped + "," + last3;
}

/**
 * Format a numeric price value into the configured currency string.
 *
 * @example
 *   fmt(799)      // "₹799"
 *   fmt(1500)     // "₹1,500"
 *   fmt(100000)   // "₹1,00,000"
 */
export function fmt(amount: number): string {
  const converted = Math.round((amount ?? 0) * CURRENCY.rate);
  return `${CURRENCY.symbol}${inrGroup(converted)}`;
}

/**
 * Format with decimal places (use sparingly — only when cents matter, e.g. totals).
 */
export function fmtDecimal(amount: number): string {
  const [intPart, decPart] = ((amount ?? 0) * CURRENCY.rate).toFixed(2).split(".");
  return `${CURRENCY.symbol}${inrGroup(parseInt(intPart, 10))}.${decPart}`;
}
