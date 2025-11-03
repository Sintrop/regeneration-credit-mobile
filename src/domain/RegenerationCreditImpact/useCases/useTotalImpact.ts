import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks"
import { QueryKeys } from "@types";

import { rcImpactService } from "../rcImpactService";

interface ReturnUseTotalImpact {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  carbon: number;
  trees: number;
  biodiversity: number;
  area: number;
}
export function useTotalImpact(): ReturnUseTotalImpact {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.TotalImpact],
    queryFn: () => rcImpactService.getTotalImpact({ rpc })
  });

  return {
    carbon: data?.carbon ?? 0,
    biodiversity: data?.biodivesity ?? 0,
    trees: data?.trees ?? 0,
    area: data?.area ?? 0,
    isError,
    isLoading,
    refetch
  }
}