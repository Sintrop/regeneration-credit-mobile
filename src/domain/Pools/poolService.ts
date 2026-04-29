import { poolContract } from "./poolContract";
import { Era, PoolData } from "./types";
import { rcService } from "../RegenerationCredit/rcService";

const DEFAULT_POOL_FUNDS: Record<number, string> = {
  1: '750000000000000000000000000',   // REGENERATOR_POOL_FUNDS
  2: '230000000000000000000000000',   // INSPECTOR_POOL_FUNDS
  3: '40000000000000000000000000',    // RESEARCHER_POOL_FUNDS
  4: '40000000000000000000000000',    // DEVELOPER_POOL_FUNDS
  5: '40000000000000000000000000',    // CONTRIBUTOR_POOL_FUNDS
  6: '40000000000000000000000000'     // ACTIVIST_POOL_FUNDS
};

const PHASES_PER_EPOCH = 12;

function calculateDistributionPerEra(totalTokens: number, epoch: number): number {
  // Epoch começa em 1, halving: epoch 1 = /2, epoch 2 = /4, epoch 3 = /8, etc.
  if (epoch < 1) epoch = 1;
  const halvingDivisor = Math.pow(2, epoch);
  const tokensPerEpoch = totalTokens / halvingDivisor;
  return tokensPerEpoch / PHASES_PER_EPOCH;
}

async function getEra({ rpc, userType, eraId }: { rpc: string, userType: number, eraId: number }): Promise<Era> {
  return poolContract.getEra({ rpc, userType, eraId });
}

async function getPoolData({ rpc, userType }: { rpc: string, userType: number }): Promise<PoolData> {
  try {
    const pool = poolContract.poolContracts[userType];
    const totalTokensStr = DEFAULT_POOL_FUNDS[userType] || '0';
    const totalTokens = Number(totalTokensStr) / 10 ** 18;

    if (!pool) throw new Error('Pool contract not found for userType: ' + userType);

    const currentEra = await poolContract.currentContractEra({ rpc, userType });
    const currentEpoch = await poolContract.currentEpoch({ rpc, userType }) || 1;
    const balance = await rcService.getBalance({ rpc, address: pool.address });
    const distributionPerEra = calculateDistributionPerEra(totalTokens, currentEpoch);

    return {
      success: true,
      totalTokens,
      currentEra,
      currentEpoch,
      balance,
      usedTokens: 0,
      balancePercentage: 0,
      distributionPerEra
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      totalTokens: 0,
      currentEra: 0,
      currentEpoch: 0,
      balance: 0,
      usedTokens: 0,
      balancePercentage: 0,
      distributionPerEra: 0
    }
  }
}

export const poolService = {
  getEra,
  getPoolData
}
