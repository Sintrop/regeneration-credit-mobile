import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { feedEventsService } from "../events/feedEventsService";

// Stable fallback: a new [] on every render would retrigger effects that depend on the lists.
const EMPTY: never[] = [];

function useEventsQuery<T>(key: QueryKeys, fetcher: (rpc: string) => Promise<T[]>) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [key],
    queryFn: () => fetcher(rpc),
  });
  return { data: data ?? (EMPTY as T[]), isLoading, refetch };
}

export function useFeedEvents() {
  const invitations = useEventsQuery(QueryKeys.FeedInvitations, feedEventsService.getInvitations);
  const treeFundings = useEventsQuery(QueryKeys.FeedTreeFundings, feedEventsService.getTreeFundings);
  const enteredPool = useEventsQuery(QueryKeys.FeedRegeneratorsEnteredPool, feedEventsService.getRegeneratorsEnteredPool);
  const marketOffers = useEventsQuery(QueryKeys.FeedMarketOffers, feedEventsService.getMarketOffers);

  return {
    invitations: invitations.data,
    treeFundings: treeFundings.data,
    regeneratorsEnteredPool: enteredPool.data,
    marketOffers: marketOffers.data,
    isLoading: invitations.isLoading || treeFundings.isLoading || enteredPool.isLoading || marketOffers.isLoading,
    refetch: () => {
      invitations.refetch();
      treeFundings.refetch();
      enteredPool.refetch();
      marketOffers.refetch();
    },
  };
}
