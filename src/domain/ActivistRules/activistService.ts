
import { activistAdapter } from "./activistAdapter";
import { activistContract } from "./activistContract";
import { ActivistProps, } from "./types";

interface GetActivistProps {
  rpc: string;
  address: string;
}
async function getActivist({ address, rpc }: GetActivistProps): Promise<ActivistProps> {
  const response = await activistContract.getActivist({ address, rpc });
  return activistAdapter.parseActivist(response);
}

export const activistService = {
  getActivist
}