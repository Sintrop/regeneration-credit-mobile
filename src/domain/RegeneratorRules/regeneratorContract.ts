import Web3 from "web3";

import { RegeneratorRules } from "@contracts";
import { CoordinateContractProps, RegeneratorContractProps } from "./types";

interface GetRegeneratorProps {
  rpc: string;
  address: string;
}
async function getRegenerator({ rpc, address }: GetRegeneratorProps): Promise<RegeneratorContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorRules.abi, RegeneratorRules.address);

  const response = await contract.methods.getRegenerator(address).call() as RegeneratorContractProps;
  return response;
}

interface ProjectDescriptionsProps {
  rpc: string;
  address: string;
}
async function projectDescriptions({ rpc, address }: ProjectDescriptionsProps): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorRules.abi, RegeneratorRules.address);

  const response = await contract.methods.projectDescriptions(address).call() as string;
  return response;
}

interface GetCoordinatesProps {
  rpc: string;
  address: string;
}
async function getCoordinates({ rpc, address }: GetCoordinatesProps): Promise<CoordinateContractProps[]> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegeneratorRules.abi, RegeneratorRules.address);

  const response = await contract.methods.getCoordinates(address).call() as CoordinateContractProps[];
  return response;
}

export const regeneratorContract = {
  getRegenerator,
  projectDescriptions,
  getCoordinates
}