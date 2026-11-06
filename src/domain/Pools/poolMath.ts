/** POOL_HALVING in the deploy config: eras per epoch. */
export const POOL_HALVING = 12;

/** Blockable.getEpochForEra */
export function epochForEra(era: number): number {
  if (era < 1) return 1;
  return Math.floor((era - 1) / POOL_HALVING) + 1;
}

/** Poolable.tokensPerEra(epoch, halving): totalTokens / 2^epoch / halving */
export function tokensForEra(totalTokens: number, era: number): number {
  return totalTokens / 2 ** epochForEra(era) / POOL_HALVING;
}

/** Poolable._calculateUserEraTokens: userLevels * tokensPerEra / eraLevels (0 without levels). */
export function userEraTokens(userLevels: number, eraLevels: number, eraTokens: number): number {
  if (userLevels <= 0 || eraLevels <= 0) return 0;
  return (userLevels * eraTokens) / eraLevels;
}

export type EraPhase = "current" | "claimable";

/** An era can be withdrawn once it is behind the pool's current era (Blockable.canWithdraw). */
export function eraPhase(era: number, currentEra: number): EraPhase {
  return era < currentEra ? "claimable" : "current";
}

export function percentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (part / total) * 100));
}
