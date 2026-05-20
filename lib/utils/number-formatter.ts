/**
 * Format large numbers with K, M, B, T abbreviations
 * @example
 * formatLargeNumber(1200) => "1.2K"
 * formatLargeNumber(1500000) => "1.5M"
 * formatLargeNumber(999) => "999"
 */
export function formatLargeNumber(num: number, decimals = 1): string {
  if (num < 1000) return Math.floor(num).toString();

  const units = ['K', 'M', 'B', 'T'];
  let divisor = 1000;
  let unitIndex = 0;

  while (num >= divisor * 1000 && unitIndex < units.length - 1) {
    divisor *= 1000;
    unitIndex++;
  }

  const result = (num / divisor).toFixed(decimals);
  return `${parseFloat(result).toString().replace(/\.?0+$/, '')}${units[unitIndex]}`;
}

/**
 * Format currency with K, M, B, T abbreviations
 * @example
 * formatCurrency(1200, 'ETB') => "1.2K ETB"
 * formatCurrency(1500000, 'USD') => "1.5M USD"
 */
export function formatCurrency(amount: number | string, currency: string, decimals = 1): string {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

  if (safeAmount < 1000) return `${currency} ${safeAmount.toFixed(2)}`;

  const formatted = formatLargeNumber(safeAmount, decimals);
  return `${formatted} ${currency}`;
}
