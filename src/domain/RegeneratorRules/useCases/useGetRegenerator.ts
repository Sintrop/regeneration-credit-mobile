import { useSettingsContext } from "@hooks";
import { useQuery } from "@tanstack/react-query";
import { regeneratorService } from "@domain";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useGetRegenerator({ address }: Props) {
  const { rpc } = useSettingsContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetRegenerator, address],
    queryFn: () => regeneratorService.getRegenerator({ rpc, address: address ? address : "" }),
    enabled: address ? true : false
  });

  return {
    regenerator: data,
    isLoading,
    isError,
    refetch
  }
}