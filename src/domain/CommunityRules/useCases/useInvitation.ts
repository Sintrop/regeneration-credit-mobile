import { useQuery } from "@tanstack/react-query";
import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface Props {
  address?: string;
}
export function useInvitation({ address }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.Invitation, address],
    queryFn: () => communityService.getInvitation({ address: address ? address : "", rpc }),
    enabled: address ? true : false
  });

  return {
    invitation: data,
    isError,
    isLoading,
    refetch
  }
}