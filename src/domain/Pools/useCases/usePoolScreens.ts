import { useQuery } from "@tanstack/react-query";

import { useSettingsContext, useUserContext } from "@hooks";
import { QueryKeys } from "@types";

import { getPoolEraDetails, getPoolOverview, getPoolUserPosition } from "../poolOverviewService";

export function usePoolOverview(userType: number) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.PoolOverview, userType],
    queryFn: () => getPoolOverview(rpc, userType),
  });
  return { overview: data, isLoading, refetch };
}

export function usePoolEraDetails(userType: number, era: number, currentEra?: number, totalTokens?: number) {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.PoolEraDetails, userType, era],
    queryFn: () => getPoolEraDetails(rpc, userType, era, currentEra as number, totalTokens as number),
    enabled: era > 0 && !!currentEra && !!totalTokens,
  });
  return { details: data, isLoading };
}

/** Position of the connected user in the pool, only when the pool is of their type. */
export function usePoolUserPosition(userType: number, currentEra?: number, totalTokens?: number) {
  const { rpc } = useSettingsContext();
  const { address, userType: connectedType } = useUserContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.PoolUserPosition, userType, address],
    queryFn: () => getPoolUserPosition(rpc, userType, address, currentEra as number, totalTokens as number),
    enabled: !!address && connectedType === userType && !!currentEra && !!totalTokens,
  });
  return { position: data, isLoading, refetch };
}
