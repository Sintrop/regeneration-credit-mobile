import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { researcherService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  researchId: number
}
export function useGetResearch({ researchId }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetResearch, researchId],
    queryFn: () => researcherService.getResearch({ researchId, rpc })
  })

  return {
    research: data,
    isLoading,
    isError,
    refetch
  }
}