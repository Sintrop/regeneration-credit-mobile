import { supporterAdapter } from "./supporterAdapter";
import { supporterContract } from "./supporterContract";
import { OffsetProps, SupporterProps } from "./types";

interface GetSupporter {
  rpc: string;
  address: string;
}
async function getSupporter({ address, rpc }: GetSupporter): Promise<SupporterProps> {
  const response = await supporterContract.getSupporter({ address, rpc });
  return supporterAdapter.parseSupporter(response);
}

interface GetOffset {
  rpc: string;
  id: number;
}
async function getOffset({ id, rpc }: GetOffset): Promise<OffsetProps> {
  const response = await supporterContract.offsets({ id, rpc });
  return supporterAdapter.parseOffsetContract(response);
}

interface IGetSupporterAddress {
  rpc: string;
  id: number;
}
async function getSupporterAddress({ id, rpc }: IGetSupporterAddress): Promise<string> {
  const response = await supporterContract.supportersAddress({ id, rpc });
  return response;
}

export const supporterService = {
  getSupporter,
  getOffset,
  getSupporterAddress
}