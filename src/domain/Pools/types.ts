export interface Era {
  claimsCount: number;
  tokens: number;
  levels: number;
}

export interface PoolData {
  success: boolean;
  totalTokens: number;
  currentEra: number;
  currentEpoch: number;
  balance: number;
  usedTokens: number;
  balancePercentage: number;
  distributionPerEra: number;
}
