import Web3 from "web3";

import { InspectionRules } from "@contracts";
import { ImpactPerEraContractProps, InspectionContractProps } from "@domain";
import { bigNumberToFloat } from "@utils";

async function inspectionsTotalCount({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectionRules.abi, InspectionRules.address);

  const response = await contract.methods.inspectionsTotalCount().call() as string;
  return response;
}

interface GetInspectionProps {
  rpc: string;
  inspectionId: number;
}
async function getInspection({ rpc, inspectionId }: GetInspectionProps): Promise<InspectionContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectionRules.abi, InspectionRules.address);

  const response = await contract.methods.getInspection(inspectionId).call() as InspectionContractProps;
  return response;
}

interface GetInspectionsHistoryProps {
  rpc: string;
  address: string;
}
async function getInspectionsHistory({ rpc, address }: GetInspectionsHistoryProps): Promise<number[]> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectionRules.abi, InspectionRules.address);

  const response = await contract.methods.getInspectionsHistory(address).call() as string[];
  return response.map(bigNumberToFloat);
}

interface ImpactPerEraProps {
  rpc: string;
  era: number;
}
async function impactPerEra({ rpc, era }: ImpactPerEraProps): Promise<ImpactPerEraContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(InspectionRules.abi, InspectionRules.address);

  const response = await contract.methods.impactPerEra(era).call() as ImpactPerEraContractProps;
  return response;
}

export const inspectionContract = {
  inspectionsTotalCount,
  getInspection,
  getInspectionsHistory,
  impactPerEra
}