import { rcContract } from "./rcContract";

async function getBalance({ address, rpc }: { address: string; rpc: string }): Promise<void> {
  const response = await rcContract.balanceOf({ address, rpc })
  console.log(response)
}

export const rcService = {
  getBalance
}