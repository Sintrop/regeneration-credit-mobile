import { getPublishAvailability, PublisherUserType, useBlockNumber, usePublishingRules } from "@domain";
import { useUserContext } from "@hooks";

type PublishKind = "resource" | "calculatorItem";

export function usePublishAvailability(userType: PublisherUserType, kind: PublishKind = "resource") {
  const { address } = useUserContext();
  const { rules, isLoading, refetch } = usePublishingRules(userType, address);
  const { blockNumber } = useBlockNumber();

  const availability = rules && blockNumber
    ? getPublishAvailability({
      currentBlock: blockNumber,
      lastActionAt: kind === "calculatorItem" ? rules.lastCalculatorItemAt : rules.lastPublishedAt,
      timeBetweenWorks: rules.timeBetweenWorks,
      nextEraIn: rules.nextEraIn,
      securityBlocksToValidation: rules.securityBlocksToValidation,
      checkSecurityWindow: kind === "resource",
    })
    : null;

  return { availability, rules, isLoading: isLoading || !blockNumber, refetch };
}
