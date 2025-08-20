import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { regeneratorService } from "@domain";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useCoordinates({ address }: Props) {
  const { rpc } = useSettingsContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.Coordinates, address],
    queryFn: () => regeneratorService.getCoordinates({ rpc, address: address ? address : "" }),
    enabled: address ? true : false
  });

  return {
    coordinates: data,
    isLoading,
    isError,
    refetch
  }
}