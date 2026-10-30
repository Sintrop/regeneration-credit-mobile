const TOKEN_DECIMALS = 18;
const AMOUNT_PATTERN = /^\d+(\.\d+)?$/;

/**
 * Normalizes a user typed amount ("10,5", " 3.25 ") to a dot decimal string.
 * Returns null when the input is not a plain non-negative decimal number.
 */
export function normalizeAmountInput(input: string): string | null {
  const normalized = input.trim().replace(',', '.');
  if (!AMOUNT_PATTERN.test(normalized)) return null;
  return normalized;
}

/** Numeric value of a typed amount, for display and balance comparisons only. */
export function parseAmountInput(input: string): number {
  const normalized = normalizeAmountInput(input);
  return normalized === null ? NaN : Number(normalized);
}

/**
 * Converts a typed token amount to its integer wei representation as a string,
 * without going through floating point. Returns null for invalid input or
 * more than 18 decimal places.
 */
export function amountToWei(input: string): string | null {
  const normalized = normalizeAmountInput(input);
  if (normalized === null) return null;

  const [whole, fraction = ''] = normalized.split('.');
  if (fraction.length > TOKEN_DECIMALS) return null;

  const wei = BigInt(whole + fraction.padEnd(TOKEN_DECIMALS, '0'));
  return wei.toString();
}

/** Applies a percentage discount to a wei amount using integer math (rounds down). */
export function applyPercentageDiscount(wei: string, percentage: number): string {
  const basisPoints = BigInt(Math.round((100 - percentage) * 100));
  return ((BigInt(wei) * basisPoints) / 10000n).toString();
}

/**
 * Formats a required amount to fill an amount input, rounding up so the value
 * always covers what was asked for.
 */
export function requiredAmountToInput(amount: number, maxDecimals = 6): string {
  if (!Number.isFinite(amount) || amount <= 0) return '';
  const factor = 10 ** maxDecimals;
  const roundedUp = Math.ceil(Number((amount * factor).toPrecision(15))) / factor;
  return roundedUp.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Formats a balance to fill an amount input, truncating (never rounding up) so
 * the value never exceeds the balance it came from.
 */
export function balanceToInput(balance: number, maxDecimals = 6): string {
  if (!Number.isFinite(balance) || balance <= 0) return '';
  const factor = 10 ** maxDecimals;
  const truncated = Math.floor(balance * factor) / factor;
  if (truncated <= 0) return '';
  return truncated.toFixed(maxDecimals).replace(/\.?0+$/, '');
}
