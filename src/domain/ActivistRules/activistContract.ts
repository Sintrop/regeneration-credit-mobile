import Web3 from "web3";

import { ActivistRules } from "@contracts";
import { ActivistContractProps } from "./types";

interface GetActivistProps {
  rpc: string;
  address: string;
}
async function getActivist({ rpc, address }: GetActivistProps): Promise<ActivistContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ActivistRules.abi, ActivistRules.address);

  const response = await contract.methods.getActivist(address).call() as ActivistContractProps;
  return response;
}


export const activistContract = {
  getActivist
}