import { FeedItemProps } from "@database";
import { InspectionAcceptedProps, InspectionRealizedProps, RequestedInspectionProps } from "../InspectionRules/types";
import { ICommitment, OffsetProps } from "../SupporterRules/types";
import { ReportAdded } from "../DeveloperRules/types";
import { ResearchPublishedProps } from "../ResearcherRules/types";
import { ContributionAddedProps } from "../ContributorRules/types";
import { UserRegisteredProps } from "../CommunityRules/types";
import { PoolWithdrawalProps } from "../Pools/useCases/useWithdrawals";

function parseRequestedInspectionToFeed(data: RequestedInspectionProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.inspectionId}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.inspectionId,
    resourceType: "inspection",
    additionalData: "requested"
  }
}

function parseAcceptedInspectionToFeed(data: InspectionAcceptedProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.inspectionId}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.inspectionId,
    resourceType: "inspection",
    additionalData: "accepted"
  }
}

function parseRealizedInspectionToFeed(data: InspectionRealizedProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.inspectionId}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.inspectionId,
    resourceType: "inspection"
  }
}

function parseOffsetToFeed(data: OffsetProps): FeedItemProps {
  return {
    createdAt: data.blockNumber,
    resourceId: data.offsetId,
    resourceType: "offset",
    id: parseInt(`${data.blockNumber}${data.offsetId}`, 10),
    additionalData: JSON.stringify(data)
  }
}

function parseReportAddedToFeed(data: ReportAdded): FeedItemProps {
  return {
    id: parseInt(`${data.createdAt}${data.id}`, 10),
    createdAt: data.createdAt,
    resourceId: data.id,
    resourceType: "report",
    additionalData: JSON.stringify(data),
  }
}

function parseResearchPublishedToFeed(data: ResearchPublishedProps): FeedItemProps {
  return {
    id: parseInt(`${data.publishedAt}${data.researchId}`, 10),
    createdAt: data.publishedAt,
    resourceId: data.researchId,
    resourceType: "research",
    additionalData: JSON.stringify(data)
  }
}

function parseContributionAddedToFeed(data: ContributionAddedProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.id}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.id,
    resourceType: "contribution",
    additionalData: JSON.stringify(data)
  }
}

function parseUserRegisteredToFeed(data: UserRegisteredProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.id}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.id,
    resourceType: 'user-registered',
    additionalData: JSON.stringify(data)
  }
}

function parseCommitmentToFeed(data: ICommitment): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.calculatorItemId}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.calculatorItemId,
    resourceType: 'declared-commitment',
    additionalData: JSON.stringify(data)
  }
}

function parseWithdrawalToFeed(data: PoolWithdrawalProps): FeedItemProps {
  return {
    id: parseInt(`${data.blockNumber}${data.era}${data.poolType}`, 10),
    createdAt: data.blockNumber,
    resourceId: data.era,
    resourceType: 'pool-withdrawal',
    additionalData: JSON.stringify(data)
  }
}

export const feedAdapter = {
  parseRealizedInspectionToFeed,
  parseOffsetToFeed,
  parseReportAddedToFeed,
  parseResearchPublishedToFeed,
  parseContributionAddedToFeed,
  parseUserRegisteredToFeed,
  parseRequestedInspectionToFeed,
  parseAcceptedInspectionToFeed,
  parseCommitmentToFeed,
  parseWithdrawalToFeed
}