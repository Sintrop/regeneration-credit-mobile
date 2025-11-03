import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks"
import { QueryKeys } from "@types";

import { inspectionService } from "../inspectionService";

interface Props {
  era: number
}
export function useImpactPerEra({ era }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.ImpactPerEra, era],
    queryFn: () => inspectionService.getImpactPerEra({ rpc, era })
  });

  return {
    impactPerEra: data,
    isError,
    isLoading,
    refetch
  }
}