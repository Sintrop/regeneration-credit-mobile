import Web3 from "web3";
import { 
  RegeneratorPool, 
  InspectorPool, 
  ResearcherPool, 
  DeveloperPool, 
  ContributorPool, 
  ActivistPool 
} from "@contracts";
import { bigNumberToFloat } from "@utils";
import { Era } from "./types";

const poolContracts: Record<number, { abi: any, address: string }> = {
  1: RegeneratorPool,
  2: InspectorPool,
  3: ResearcherPool,
  4: DeveloperPool,
  5: ContributorPool,
  6: ActivistPool
};

async function getEra({ rpc, userType, eraId }: { rpc: string; userType: number; eraId: number }): Promise<Era> {
  const pool = poolContracts[userType];
  if (!pool) return { claimsCount: 0, tokens: 0, levels: 0 };

  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(pool.abi, pool.address);

  const response = await contract.methods.getEra(eraId).call() as { 
    claimsCount: string; 
    tokens: string; 
    levels: string 
  };

  return {
    claimsCount: bigNumberToFloat(response.claimsCount),
    tokens: bigNumberToFloat(response.tokens),
    levels: bigNumberToFloat(response.levels)
  };
}

async function currentContractEra({ rpc, userType }: { rpc: string; userType: number }): Promise<number> {
  const pool = poolContracts[userType];
  if (!pool) return 0;

  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(pool.abi, pool.address);

  const response = await contract.methods.currentContractEra().call() as string;
  return bigNumberToFloat(response);
}

async function currentEpoch({ rpc, userType }: { rpc: string; userType: number }): Promise<number> {
  const pool = poolContracts[userType];
  if (!pool) return 0;

  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(pool.abi, pool.address);

  const response = await contract.methods.currentEpoch().call() as string;
  return bigNumberToFloat(response);
}

export const poolContract = {
  getEra,
  currentContractEra,
  currentEpoch,
  poolContracts
}
