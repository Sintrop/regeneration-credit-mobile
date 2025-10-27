import { useQuery } from "@tanstack/react-query";
import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useGetUser({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.GetUser, address],
    queryFn: () => communityService.getUser({ address: address ? address : "", rpc }),
    enabled: address ? true : false
  });

  return {
    userType: data ? data : 0,
    isError,
    isLoading,
    refetch
  }
}