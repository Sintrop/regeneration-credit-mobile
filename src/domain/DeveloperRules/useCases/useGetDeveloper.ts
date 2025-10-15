import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";
import { developerService } from "@domain";

interface Props {
  address: string;
}
export function useGetDeveloper({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetDeveloper, address],
    queryFn: () => developerService.getDeveloper({ address, rpc })
  });

  return {
    developer: data,
    isLoading,
    isError,
    refetch
  }
}