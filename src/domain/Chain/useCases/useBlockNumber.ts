import { useQuery } from "@tanstack/react-query";
import { chainService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

export function useBlockNumber() {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.BlockNumber],
    queryFn: () => chainService.getBlockNumber({ rpc }),
    refetchInterval: 15000
  });

  return {
    blockNumber: data ? data : 0,
    isError,
    isLoading,
    refetch
  }
}