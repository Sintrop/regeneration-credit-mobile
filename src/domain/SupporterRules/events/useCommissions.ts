import { useQuery } from "@tanstack/react-query";

import { SupporterRules } from "@contracts";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { fetchEvents, toNumber } from "../../Feed/events/fetchEvents";
import { TxProps } from "../../Tx/types";

/** SupporterRules.CommissionsPaid received by the address as inviter. */
async function getCommissions(rpc: string, address: string): Promise<TxProps[]> {
  const events = await fetchEvents(rpc, SupporterRules, "CommissionsPaid", { inviter: address });
  return events
    .map(event => ({
      coin: "RC" as const,
      type: "RECEIVE" as const,
      kind: "receive" as const,
      blockNumber: toNumber(event.blockNumber),
      hash: event.transactionHash ?? "",
      from: String(event.returnValues.supporter),
      to: String(event.returnValues.inviter),
      value: toNumber(event.returnValues.amount),
    }))
    .sort((a, b) => b.blockNumber - a.blockNumber);
}

export function useCommissions({ address }: { address?: string }) {
  const { rpc } = useSettingsContext();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Commissions, address],
    queryFn: () => getCommissions(rpc, address as string),
    enabled: !!address,
  });
  return { commissions: data ?? [], isLoading: !!address && isLoading };
}
