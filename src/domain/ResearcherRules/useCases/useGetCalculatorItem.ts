import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { researcherService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  itemId: number
}
export function useGetCalculatorItem({ itemId }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetResearch, itemId],
    queryFn: () => researcherService.getCalculatorItem({ itemId, rpc })
  })

  return {
    item: data,
    isLoading,
    isError,
    refetch
  }
}