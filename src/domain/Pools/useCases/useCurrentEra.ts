import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { useSettingsContext } from "@hooks";
import { poolContract } from "../poolContract";

export function useCurrentEra({ userType = 1 }: { userType?: number } = {}) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.CurrentEra, userType],
    queryFn: async () => {
      const currentEra = await poolContract.currentContractEra({ rpc, userType });
      const currentEpoch = await poolContract.currentEpoch({ rpc, userType });
      const nextEraIn = await poolContract.nextEraIn({ rpc, userType, currentEra });

      return {
        currentEra,
        currentEpoch,
        nextEraIn
      };
    },
  });

  return {
    data: data || { currentEra: 0, currentEpoch: 0, nextEraIn: 0 },
    isError,
    isLoading,
    refetch
  }
}
