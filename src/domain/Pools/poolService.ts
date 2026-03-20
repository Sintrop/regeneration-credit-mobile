import Config from "react-native-config";
import { poolContract } from "./poolContract";
import { Era, PoolData } from "./types";
import { rcService } from "../RegenerationCredit/rcService";

const poolFunds: Record<number, string | undefined> = {
  1: Config.REGENERATOR_POOL_FUNDS,
  2: Config.INSPECTOR_POOL_FUNDS,
  3: Config.RESEARCHER_POOL_FUNDS,
  4: Config.DEVELOPER_POOL_FUNDS,
  5: Config.CONTRIBUTOR_POOL_FUNDS,
  6: Config.ACTIVIST_POOL_FUNDS
};

async function getEra({ rpc, userType, eraId }: { rpc: string, userType: number, eraId: number }): Promise<Era> {
  return poolContract.getEra({ rpc, userType, eraId });
}

async function getPoolData({ rpc, userType }: { rpc: string, userType: number }): Promise<PoolData> {
  try {
    const pool = poolContract.poolContracts[userType];
    const totalTokensStr = poolFunds[userType] || '0';
    const totalTokens = Number(totalTokensStr) / 10 ** 18;

    if (!pool) throw new Error('Pool contract not found for userType: ' + userType);

    const currentEra = await poolContract.currentContractEra({ rpc, userType });
    const currentEpoch = await poolContract.currentEpoch({ rpc, userType });
    const balance = await rcService.getBalance({ rpc, address: pool.address });

    return {
      success: true,
      totalTokens,
      currentEra,
      currentEpoch,
      balance,
      usedTokens: 0,
      balancePercentage: 0
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
      balancePercentage: 0
    }
  }
}

export const poolService = {
  getEra,
  getPoolData
}
