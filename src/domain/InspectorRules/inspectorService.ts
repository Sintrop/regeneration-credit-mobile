import { inspectorAdapter } from "./inspectorAdapter";
import { inspectorContract } from "./inspectorContract";
import { InspectorProps } from "./types";

interface GetInspectorProps {
  rpc: string;
  address: string;
}
async function getInspector({ address, rpc }: GetInspectorProps): Promise<InspectorProps> {
  const response = await inspectorContract.getInspector({ address, rpc });
  return inspectorAdapter.parseFromContract(response);
}

interface IGetInspectorAddress {
  rpc: string;
  id: number;
}
async function getInspectorAddress({ id, rpc }: IGetInspectorAddress): Promise<string> {
  const response = await inspectorContract.inspectorsAddress({ id, rpc });
  return response;
}

export const inspectorService = {
  getInspector,
  getInspectorAddress
}