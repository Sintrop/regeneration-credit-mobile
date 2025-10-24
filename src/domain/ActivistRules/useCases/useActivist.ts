import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@types";
import { activistService } from "@domain";
import { useSettingsContext } from "@hooks";

interface Props {
  address: string;
}
export function useActivist({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetActivist, address],
    queryFn: () => activistService.getActivist({ address, rpc })
  })

  return {
    activist: data,
    isLoading,
    isError,
    refetch
  }
}