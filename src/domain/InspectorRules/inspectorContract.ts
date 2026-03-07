import Web3 from "web3";

import { InspectorRules } from "@contracts";
import { InspectorContractProps } from "./types";

interface GetInspectorProps {
  rpc: string;
  address: string;
}
async function getInspector({ rpc, address }: GetInspectorProps): Promise<InspectorContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectorRules.abi, InspectorRules.address);

  const response = await contract.methods.getInspector(address).call() as InspectorContractProps;
  return response;
}

interface IInspectorsAddress {
  rpc: string;
  id: number;
}
async function inspectorsAddress({ rpc, id }: IInspectorsAddress): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectorRules.abi, InspectorRules.address);

  const response = await contract.methods.inspectorsAddress(id).call() as string;
  return response;
}

export const inspectorContract = {
  getInspector,
  inspectorsAddress
}