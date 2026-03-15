import Config from "react-native-config";
import { RegeneratorPool } from "@contracts";

import { PoolData } from "@domain";

import { regeneratorPoolContract } from "./regeneratorPoolContract"
import { rcService } from "../RegenerationCredit/rcService";

async function getPoolData({ rpc }: { rpc: string }): Promise<PoolData> {
  try {
    const totalTokens = Number(Config.REGENERATOR_POOL_FUNDS) / 10 ** 18;
    const currentEra = await regeneratorPoolContract.currentContractEra({ rpc });
    const currentEpoch = await regeneratorPoolContract.currentEpoch({ rpc });
    const balance = await rcService.getBalance({ rpc, address: RegeneratorPool.address });

    return {
      success: true,
      totalTokens,
      currentEra,
      currentEpoch,
      balance
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      totalTokens: 0,
      currentEra: 0,
      currentEpoch: 0,
      balance: 0
    }
  }
}

export const regeneratorPoolService = {
  getPoolData
}