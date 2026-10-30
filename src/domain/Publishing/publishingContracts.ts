import Web3 from "web3";

import { CommunityRules, ContributorRules, DeveloperRules, InvitationRules, ResearcherRules } from "@contracts";

export type PublisherUserType = 3 | 4 | 5;

interface ContractRef {
  abi: any;
  address: string;
}

export const PUBLISHER_CONTRACTS: Record<PublisherUserType, ContractRef> = {
  3: ResearcherRules,
  4: DeveloperRules,
  5: ContributorRules,
};

/** Registration function of each contract: addResearcher / addDeveloper / addContributor(name, proofPhoto). */
export const REGISTER_METHOD: Record<PublisherUserType, string> = {
  3: "addResearcher",
  4: "addDeveloper",
  5: "addContributor",
};

export function isPublisherUserType(userType: number): userType is PublisherUserType {
  return userType === 3 || userType === 4 || userType === 5;
}

export interface PublishingRules {
  timeBetweenWorks: number;
  securityBlocksToValidation: number;
  nextEraIn: number;
  lastPublishedAt: number;
  lastCalculatorItemAt: number;
  canPublishMethod: boolean;
  /** <Type>Rules.canSendInvite: pool level above the type average. */
  canSendInvite: boolean;
  lastInviteBlock: number;
  invitationDelayBlocks: number;
}

const USER_GETTER: Record<PublisherUserType, string> = {
  3: "getResearcher",
  4: "getDeveloper",
  5: "getContributor",
};

export async function getPublishingRules(rpc: string, userType: PublisherUserType, address: string): Promise<PublishingRules> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new web3.eth.Contract(PUBLISHER_CONTRACTS[userType].abi, PUBLISHER_CONTRACTS[userType].address);

  const invitationRules = new web3.eth.Contract(InvitationRules.abi, InvitationRules.address);
  const communityRules = new web3.eth.Contract(CommunityRules.abi, CommunityRules.address);

  const [timeBetweenWorks, securityBlocksToValidation, nextEraIn, user, canSendInvite, lastInviteBlock, settings] = await Promise.all([
    contract.methods.timeBetweenWorks().call(),
    contract.methods.securityBlocksToValidation().call(),
    contract.methods.nextEraIn().call(),
    contract.methods[USER_GETTER[userType]](address).call(),
    contract.methods.canSendInvite(address).call(),
    invitationRules.methods.lastInviteBlocks(address).call(),
    communityRules.methods.getUserTypeSettings(userType).call(),
  ]) as any[];

  return {
    timeBetweenWorks: Number(timeBetweenWorks),
    securityBlocksToValidation: Number(securityBlocksToValidation),
    nextEraIn: Number(nextEraIn),
    lastPublishedAt: Number(user?.lastPublishedAt ?? 0),
    lastCalculatorItemAt: Number(user?.lastCalculatorItemAt ?? 0),
    canPublishMethod: Boolean(user?.canPublishMethod),
    canSendInvite: Boolean(canSendInvite),
    lastInviteBlock: Number(lastInviteBlock),
    invitationDelayBlocks: Number(settings?.invitationDelayBlocks ?? 0),
  };
}
