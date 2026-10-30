import { useQuery } from "@tanstack/react-query";

import { InvitationRules } from "@contracts";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { fetchEvents, toNumber } from "../../Feed/events/fetchEvents";

export interface InvitedUser {
  invited: string;
  invitedType: number;
  blockNumber: number;
}

/** InvitationRules.UserInvited sent by one inviter, newest first. */
async function getInvitedUsers(rpc: string, inviter: string): Promise<InvitedUser[]> {
  const events = await fetchEvents(rpc, InvitationRules, "UserInvited", { inviter });
  return events
    .map(event => ({
      invited: String(event.returnValues.invited),
      invitedType: toNumber(event.returnValues.invitedType),
      blockNumber: toNumber(event.returnValues.blockNumber ?? event.blockNumber),
    }))
    .sort((a, b) => b.blockNumber - a.blockNumber);
}

export function useInvitedUsers(inviter?: string) {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.InvitedUsers, inviter],
    queryFn: () => getInvitedUsers(rpc, inviter as string),
    enabled: !!inviter,
  });
  return { invited: data ?? [], isLoading };
}
