import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { useSettingsContext } from "@hooks";
import { poolService } from "./poolService";

export function usePoolData({ userType }: { userType: number }) {
  const { rpc } = useSettingsContext();
  const { data: rawData, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.PoolData, userType],
    queryFn: async () => {
      const response = await poolService.getPoolData({ rpc, userType });
      if (!response.success) throw new Error('Error on get pool data');
      return response;
    },
  });

  const data = useMemo(() => {
    if (!rawData) return null;

    const usedTokens = Math.max(0, rawData.totalTokens - rawData.balance);
    const balancePercentage = rawData.totalTokens > 0
      ? Math.round((rawData.balance / rawData.totalTokens) * 100)
      : 0;

    return {
      ...rawData,
      usedTokens,
      balancePercentage
    };
  }, [rawData]);

  return {
    data,
    isError,
    isLoading,
    refetch
  }
}
