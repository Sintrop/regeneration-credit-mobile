import { contributorAdapter } from "./contributorAdapter";
import { contributorContract } from "./contributorContract";
import { ContributionProps, ContributorProps } from "./types";

interface GetContributorProps {
  rpc: string;
  address: string;
}
async function getContributor({ address, rpc }: GetContributorProps): Promise<ContributorProps> {
  const response = await contributorContract.getContributor({ address, rpc });
  return contributorAdapter.parseContributor(response);
}

interface GetContributionProps {
  rpc: string;
  contributionId: number;
}
async function getContribution({ contributionId, rpc }: GetContributionProps): Promise<ContributionProps> {
  const response = await contributorContract.getContribution({ contributionId, rpc });
  return contributorAdapter.parseContribution(response);
}

export const contributorService = {
  getContributor,
  getContribution
}