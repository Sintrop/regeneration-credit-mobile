import Web3 from "web3";

import { CommunityRules } from "@contracts";
import { InvitationContractProps } from "./types";

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

export const communityContract = {
  getUser,
  getInvitation
}