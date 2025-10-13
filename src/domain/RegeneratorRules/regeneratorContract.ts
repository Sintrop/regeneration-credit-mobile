import Web3 from "web3";

import { RegeneratorRules } from "@contracts";
import { RegeneratorContractProps } from "./types";

interface GetRegeneratorProps {
  rpc: string;
  address: string;
}
async function getRegenerator({ rpc, address }: GetRegeneratorProps): Promise<RegeneratorContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorRules.abi, RegeneratorRules.address);

  const response = await contract.methods.getRegenerator(address).call() as RegeneratorContractProps;
  return response;
}

export const regeneratorContract = {
  getRegenerator
}