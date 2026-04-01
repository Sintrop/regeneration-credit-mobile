import Web3 from "web3";

import { RegeneratorPool } from "@contracts";
import { bigNumberToFloat } from "@utils";

async function totalTokens({ rpc }: { rpc: string; }): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorPool.abi, RegeneratorPool.address);

  const response = await contract.methods.totalTokens().call() as string;
  return bigNumberToFloat(response);
}

async function currentContractEra({ rpc }: { rpc: string; }): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorPool.abi, RegeneratorPool.address);

  const response = await contract.methods.currentContractEra().call() as string;
  return bigNumberToFloat(response);
}

async function currentEpoch({ rpc }: { rpc: string; }): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorPool.abi, RegeneratorPool.address);

  const response = await contract.methods.currentEpoch().call() as string;
  return bigNumberToFloat(response);
}

export const regeneratorPoolContract = {
  totalTokens,
  currentContractEra,
  currentEpoch
}