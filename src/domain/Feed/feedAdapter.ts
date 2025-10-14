import { FeedItemProps } from "@database";
import { InspectionRealizedProps } from "../InspectionRules/types";
import { OffsetProps } from "../SupporterRules/types";

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

export const feedAdapter = {
  parseRealizedInspectionToFeed,
  parseOffsetToFeed
}