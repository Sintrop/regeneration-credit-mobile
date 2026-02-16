import { useQuery } from "@tanstack/react-query";
import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface Props {
  userType?: number;
}
export function useUserTypesTotalCount({ userType }: Props) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UserTypesTotalCount, userType],
    queryFn: () => communityService.getUserTypesTotalCount({ userType: userType ? userType : 0, rpc }),
    enabled: userType ? true : false
  });

  const ids = Array.from({ length: data ?? 0 }, (_, i) => i + 1);

  return {
    count: data ? data : 0,
    ids,
    isError,
    isLoading,
    refetch
  }
}
