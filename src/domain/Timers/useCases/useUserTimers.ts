import { useQuery } from "@tanstack/react-query";

import { useSettingsContext, useUserContext } from "@hooks";
import { QueryKeys } from "@types";

import { getTimerInputs } from "../timersService";
import { buildUserTimers } from "../userTimers";

const ONE_MINUTE = 60 * 1000;

/** Time-gated actions of the connected user, refreshed every minute. */
export function useUserTimers() {
  const { rpc } = useSettingsContext();
  const { address, userType } = useUserContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.UserTimers, address, userType],
    queryFn: async () => buildUserTimers(await getTimerInputs(rpc, address, userType)),
    enabled: !!address && userType > 0,
    refetchInterval: ONE_MINUTE,
  });

  return { timers: data ?? [], isLoading, refetch };
}
