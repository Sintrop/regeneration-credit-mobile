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

export const inspectorService = {
  getInspector
}