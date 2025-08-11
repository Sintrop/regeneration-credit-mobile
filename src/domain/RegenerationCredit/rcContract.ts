import Web3 from "web3";

import { RegenerationCredit } from "@contracts";

async function balanceOf({ address, rpc }: { address: string; rpc: string }): Promise<any> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  try {
    const response = await contract.methods.balanceOf(address).call();
    return response;
  } catch (e) {
    Promise.reject()
  }
}

export const rcContract = {
  balanceOf
}