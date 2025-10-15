import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { contributorService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  address: string;
}
export function useGetContributor({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetContributor, address],
    queryFn: () => contributorService.getContributor({ address, rpc })
  })

  return {
    contributor: data,
    isLoading,
    isError,
    refetch
  }
}