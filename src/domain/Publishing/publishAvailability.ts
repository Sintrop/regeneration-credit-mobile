export type PublishBlockReason = "waitTime" | "eraEnding";

export interface PublishAvailability {
  canPublish: boolean;
  reason?: PublishBlockReason;
  /** Blocks until publishing opens again. */
  blocksToWait: number;
}

interface Params {
  currentBlock: number;
  lastActionAt: number;
  timeBetweenWorks: number;
  nextEraIn: number;
  securityBlocksToValidation: number;
  /** Calculator items are not blocked by the end-of-era security window. */
  checkSecurityWindow?: boolean;
}

/**
 * Mirrors the publish requirements of ResearcherRules / DeveloperRules / ContributorRules:
 * - block.number > lastActionAt + timeBetweenWorks, or never published (lastActionAt == 0)
 * - nextEraIn() > securityBlocksToValidation
 */
export function getPublishAvailability({
  currentBlock,
  lastActionAt,
  timeBetweenWorks,
  nextEraIn,
  securityBlocksToValidation,
  checkSecurityWindow = true,
}: Params): PublishAvailability {
  if (lastActionAt > 0 && currentBlock <= lastActionAt + timeBetweenWorks) {
    return { canPublish: false, reason: "waitTime", blocksToWait: lastActionAt + timeBetweenWorks - currentBlock + 1 };
  }

  if (checkSecurityWindow && nextEraIn <= securityBlocksToValidation) {
    return { canPublish: false, reason: "eraEnding", blocksToWait: nextEraIn };
  }

  return { canPublish: true, blocksToWait: 0 };
}
