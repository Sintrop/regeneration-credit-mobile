import Web3 from "web3";

import { RegenerationCreditImpact } from "@contracts";

async function treesPerToken({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.treesPerToken().call() as string;
  return response;
}

async function carbonPerToken({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.carbonPerToken().call() as string;
  return response;
}

async function biodiversityPerToken({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.biodiversityPerToken().call() as string;
  return response;
}

async function areaPerToken({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.areaPerToken().call() as string;
  return response;
}

async function totalTreesImpact({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.totalTreesImpact().call() as string;
  return response;
}

async function totalCarbonImpact({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.totalCarbonImpact().call() as string;
  return response;
}

async function totalBiodiversityImpact({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.totalBiodiversityImpact().call() as string;
  return response;
}

async function totalAreaImpact({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCreditImpact.abi, RegenerationCreditImpact.address);

  const response = await contract.methods.totalAreaImpact().call() as string;
  return response;
}

export const rcImpactContract = {
  treesPerToken,
  areaPerToken,
  biodiversityPerToken,
  carbonPerToken,
  totalAreaImpact,
  totalBiodiversityImpact,
  totalCarbonImpact,
  totalTreesImpact
}