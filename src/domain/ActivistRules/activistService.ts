
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

interface IGetActivistAddress {
  rpc: string;
  id: number;
}
async function getActivistAddress({ id, rpc }: IGetActivistAddress): Promise<string> {
  const response = await activistContract.activistsAddress({ id, rpc });
  return response;
}

export const activistService = {
  getActivist,
  getActivistAddress
}