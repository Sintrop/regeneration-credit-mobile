import Web3 from "web3";

import { ContributorRules } from "@contracts";
import { ContributionContractProps, ContributorContractProps } from "./types";

interface GetContributorProps {
  rpc: string;
  address: string;
}
async function getContributor({ rpc, address }: GetContributorProps): Promise<ContributorContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ContributorRules.abi, ContributorRules.address);

  const response = await contract.methods.getContributor(address).call() as ContributorContractProps;
  return response;
}

interface GetContributionProps {
  rpc: string;
  contributionId: number;
}
async function getContribution({ rpc, contributionId }: GetContributionProps): Promise<ContributionContractProps> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(ContributorRules.abi, ContributorRules.address);

  const response = await contract.methods.getContribution(contributionId).call() as ContributionContractProps;
  return response;
}

export const contributorContract = {
  getContributor,
  getContribution
}