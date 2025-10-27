import { useQuery } from "@tanstack/react-query";
import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface ReturnUseUserTypesCount {
  count: number;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}
interface Props {
  userType?: number;
}
export function useUserTypesCount({ userType }: Props): ReturnUseUserTypesCount {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UserTypesCount, userType],
    queryFn: () => communityService.getUserTypesCount({ userType: userType ? userType : 0, rpc }),
    enabled: userType ? true : false
  });

  return {
    count: data ? data : 0,
    isError,
    isLoading,
    refetch
  }
}