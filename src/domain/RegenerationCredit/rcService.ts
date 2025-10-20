import { bigNumberToFloat } from "@utils";
import { rcContract } from "./rcContract";

async function getBalance({ address, rpc }: { address: string; rpc: string }): Promise<number> {
  const response = await rcContract.balanceOf({ address, rpc })
  return bigNumberToFloat(response) / 10 ** 18;
}

async function getTokensAllowed({ address, rpc, spendAddress }: { address: string; rpc: string; spendAddress: string; }): Promise<number> {
  const response = await rcContract.allowance({ address, rpc, spendAddress })
  return bigNumberToFloat(response) / 10 ** 18;
}

export const rcService = {
  getBalance,
  getTokensAllowed
}