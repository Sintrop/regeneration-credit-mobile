import { regeneratorAdapter } from "./regeneratorAdapter";
import { regeneratorContract } from "./regeneratorContract";
import { RegeneratorProps } from "./types";

interface GetRegeneratorProps {
  rpc: string;
  address: string;
}
async function getRegenerator({ address, rpc }: GetRegeneratorProps): Promise<RegeneratorProps> {
  const response = await regeneratorContract.getRegenerator({ rpc, address })
  return regeneratorAdapter.parseFromContract(response);
}
export const regeneratorService = {
  getRegenerator
}