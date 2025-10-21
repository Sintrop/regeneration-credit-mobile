import Web3 from "web3";

import { CommunityRules } from "@contracts";
import { DelationContractProps, InvitationContractProps } from "./types";

interface GetUserProps {
  rpc: string;
  address: string;
}
async function getUser({ rpc, address }: GetUserProps): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(CommunityRules.abi, CommunityRules.address);

  const response = await contract.methods.getUser(address).call() as string;
  return response;
}

interface GetInvitationProps {
  rpc: string;
  address: string;
}
async function getInvitation({ rpc, address }: GetInvitationProps): Promise<InvitationContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(CommunityRules.abi, CommunityRules.address);

  const response = await contract.methods.getInvitation(address).call() as InvitationContractProps;
  return response;
}

interface GetDelationsProps {
  rpc: string;
  address: string;
}
async function getUserDelations({ rpc, address }: GetDelationsProps): Promise<DelationContractProps[]> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(CommunityRules.abi, CommunityRules.address);

  const response = await contract.methods.getUserDelations(address).call() as DelationContractProps[];
  return response;
}

interface UserTypesCountProps {
  rpc: string;
  userType: number;
}
async function userTypesCount({ rpc, userType }: UserTypesCountProps): Promise<string> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(CommunityRules.abi, CommunityRules.address);

  const response = await contract.methods.userTypesCount(userType).call() as string;
  return response;
}

export const communityContract = {
  getUser,
  getInvitation,
  getUserDelations,
  userTypesCount
}