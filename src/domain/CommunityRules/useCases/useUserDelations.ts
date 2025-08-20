import { useQuery } from "@tanstack/react-query";
import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useUserDelations({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UserDelations, address],
    queryFn: () => communityService.getDelations({ address: address ? address : "", rpc }),
    enabled: address ? true : false
  });

  return {
    delations: data,
    isError,
    isLoading,
    refetch
  }
}