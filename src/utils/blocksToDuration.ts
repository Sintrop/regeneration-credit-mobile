/** Block time configured in go-sintrop (Sintrop Impact Blockchain). */
export const SECONDS_PER_BLOCK = 13;

const SECONDS_PER_HOUR = 60 * 60;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

export type DurationUnit = 'days' | 'hours' | 'minutes';

export interface ApproximateDuration {
  value: number;
  unit: DurationUnit;
}

/**
 * Converts a block count into an approximate duration, picking the largest unit
 * that keeps the value at 1 or more. Values are rounded, so they read as "~N".
 */
export function blocksToDuration(blocks: number, secondsPerBlock = SECONDS_PER_BLOCK): ApproximateDuration {
  const seconds = Math.max(0, blocks) * Math.max(0, secondsPerBlock);

  if (seconds >= SECONDS_PER_DAY) return { value: Math.round(seconds / SECONDS_PER_DAY), unit: 'days' };
  if (seconds >= SECONDS_PER_HOUR) return { value: Math.round(seconds / SECONDS_PER_HOUR), unit: 'hours' };
  return { value: Math.max(1, Math.round(seconds / 60)), unit: 'minutes' };
}
