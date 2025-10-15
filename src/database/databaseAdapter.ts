import { FeedDBProps, FeedItemProps } from "./types";

function fromDbToFeedItem(data: FeedDBProps): FeedItemProps {
  return {
    id: data.id,
    createdAt: data.created_at,
    resourceId: data.resource_id,
    resourceType: data.resource_type
  }
}

export const databaseAdapter = {
  fromDbToFeedItem
}