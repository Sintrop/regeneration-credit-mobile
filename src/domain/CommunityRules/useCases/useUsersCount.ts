import { useQuery } from "@tanstack/react-query";

import { communityService } from "@domain";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

interface ReturnUseUsersCount {
  count: number;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export function useUsersCount(): ReturnUseUsersCount {
  const { rpc } = useSettingsContext();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QueryKeys.UsersCount],
    queryFn: () => communityService.getUsersCount({ rpc }),
  });

  return {
    count: data ? data : 0,
    isError,
    isLoading,
    refetch
  }
}
