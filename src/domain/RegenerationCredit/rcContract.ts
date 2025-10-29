import Web3 from "web3";

import { RegenerationCredit } from "@contracts";

async function balanceOf({ address, rpc }: { address: string; rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const response = await contract.methods.balanceOf(address).call() as string;
  return response;

}

async function allowance({ address, rpc, spendAddress }: { address: string; rpc: string; spendAddress: string; }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const response = await contract.methods.allowance(address, spendAddress).call() as string;
  return response;
}

async function totalCertified({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const response = await contract.methods.totalCertified().call() as string;
  return response;
}

async function totalLocked({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const response = await contract.methods.totalLocked().call() as string;
  return response;
}

async function totalSupply({ rpc }: { rpc: string }): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RegenerationCredit.abi, RegenerationCredit.address);

  const response = await contract.methods.totalSupply().call() as string;
  return response;
}

export const rcContract = {
  balanceOf,
  allowance,
  totalCertified,
  totalLocked,
  totalSupply
}