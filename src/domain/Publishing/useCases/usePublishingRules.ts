import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { PublisherUserType, getPublishingRules } from "../publishingContracts";

export function usePublishingRules(userType: PublisherUserType, address?: string) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.PublishingRules, userType, address],
    queryFn: () => getPublishingRules(rpc, userType, address as string),
    enabled: !!address,
  });

  return { rules: data, isLoading, refetch };
}
