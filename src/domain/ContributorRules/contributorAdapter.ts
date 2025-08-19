import { bigNumberToFloat } from "@utils";
import { ContributionContractProps, ContributionProps, ContributorContractProps, ContributorProps } from "./types";

function parseContributor(data: ContributorContractProps): ContributorProps {
  return {
    id: bigNumberToFloat(data.id),
    address: data.contributorWallet,
    createdAt: bigNumberToFloat(data.createdAt),
    lastPublishedAt: bigNumberToFloat(data.lastPublishedAt),
    name: data.name,
    proofPhoto: data.proofPhoto,
    pool: {
      level: bigNumberToFloat(data.pool.level),
      currentEra: bigNumberToFloat(data.pool.currentEra)
    }
  }
}

function parseContribution(data: ContributionContractProps): ContributionProps {
  return {
    id: bigNumberToFloat(data.id),
    contributor: data.user,
    createdAt: bigNumberToFloat(data.createdAtBlockNumber),
    description: data.description,
    era: bigNumberToFloat(data.era),
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    report: data.report,
    valid: data.valid,
    validationsCount: bigNumberToFloat(data.validationsCount)
  }
}

export const contributorAdapter = {
  parseContributor,
  parseContribution
}