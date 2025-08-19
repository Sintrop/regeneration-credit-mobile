import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { researcherService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  address: string
}
export function useGetResearcher({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetResearcher, address],
    queryFn: () => researcherService.getResearcher({ address, rpc })
  })

  return {
    researcher: data,
    isLoading,
    isError,
    refetch
  }
}