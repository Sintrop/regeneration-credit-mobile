import Web3 from "web3";

import { SupporterRules } from "@contracts";
import { OffsetContractProps, SupporterContractProps } from "./types";

interface GetSupporter {
  rpc: string;
  address: string;
}
async function getSupporter({ rpc, address }: GetSupporter): Promise<SupporterContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(SupporterRules.abi, SupporterRules.address);

  const response = await contract.methods.getSupporter(address).call() as SupporterContractProps;
  return response;
}

interface Offsets {
  rpc: string;
  id: number;
}
async function offsets({ rpc, id }: Offsets): Promise<OffsetContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(SupporterRules.abi, SupporterRules.address);

  const response = await contract.methods.offsets(id).call() as OffsetContractProps;
  return response;
}

export const supporterContract = {
  getSupporter,
  offsets
}