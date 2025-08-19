export interface FeedDBProps {
  id: number;
  resource_id: number;
  resource_type: ResourcesTypes;
  created_at: number;
}

export interface FeedItemProps {
  id: number;
  resourceId: number;
  resourceType: ResourcesTypes;
  createdAt: number;
}

export type ResourcesTypes = "inspection" | "report" | "research"