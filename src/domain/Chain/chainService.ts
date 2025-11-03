import { bigNumberToFloat } from "@utils";
import { chainContract } from "./chainContract";

async function getBlockNumber({ rpc }: { rpc: string; }): Promise<number> {
  const response = await chainContract.blockNumber({ rpc });
  //@ts-ignore
  return bigNumberToFloat(response);
}

export const chainService = {
  getBlockNumber
}