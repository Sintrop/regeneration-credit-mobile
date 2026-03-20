import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { useSettingsContext } from "@hooks";
import { poolService } from "../poolService";

export function usePoolEra({ userType, eraId }: { userType: number, eraId: number }) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.PoolEra, userType, eraId],
    queryFn: async () => {
      const response = await poolService.getEra({ rpc, userType, eraId });
      return response;
    },
  });

  return {
    data,
    isError,
    isLoading,
    refetch
  }
}
