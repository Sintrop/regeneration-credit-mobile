import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { resourcesService } from "../resourcesService";

export function usePublishedResources() {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: [QueryKeys.PublishedResources],
    queryFn: () => resourcesService.getPublishedResources({ rpc }),
  });

  return {
    resources: data ?? [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  };
}
