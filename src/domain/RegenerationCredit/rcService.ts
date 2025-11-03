import { bigNumberToFloat } from "@utils";
import { rcContract } from "./rcContract";
import { TokenDataProps } from "./types";

async function getBalance({ address, rpc }: { address: string; rpc: string }): Promise<number> {
  const response = await rcContract.balanceOf({ address, rpc })
  return bigNumberToFloat(response) / 10 ** 18;
}

async function getTokensAllowed({ address, rpc, spendAddress }: { address: string; rpc: string; spendAddress: string; }): Promise<number> {
  const response = await rcContract.allowance({ address, rpc, spendAddress })
  return bigNumberToFloat(response) / 10 ** 18;
}

async function getTokenData({ rpc }: { rpc: string }): Promise<TokenDataProps> {
  const locked = await rcContract.totalLocked({ rpc });
  const supply = await rcContract.totalSupply({ rpc });
  const certified = await rcContract.totalCertified({ rpc });

  const totalSupply = bigNumberToFloat(supply) / 10 ** 18;
  const totalLocked = bigNumberToFloat(locked) / 10 ** 18;
  const totalCertified = bigNumberToFloat(certified) / 10 ** 18;

  return {
    totalLocked,
    totalSupply,
    totalCertified,
    circulatingSuplly: totalSupply - totalLocked
  }
}

export const rcService = {
  getBalance,
  getTokensAllowed,
  getTokenData
}