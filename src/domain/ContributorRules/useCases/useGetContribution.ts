import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { contributorService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  contributionId: number
}
export function useGetContribution({ contributionId }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetContribution, contributionId],
    queryFn: () => contributorService.getContribution({ contributionId, rpc })
  })

  return {
    contribution: data,
    isLoading,
    isError,
    refetch
  }
}