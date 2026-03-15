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

const poolContracts: Record<number, { abi: any, address: string }> = {
  1: RegeneratorPool,
  2: InspectorPool,
  3: ResearcherPool,
  4: DeveloperPool,
  5: ContributorPool,
  6: ActivistPool
};

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
  currentContractEra,
  currentEpoch,
  poolContracts
}
