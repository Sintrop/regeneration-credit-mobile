import { useQuery } from "@tanstack/react-query";

import { RegenerationCredit } from "@contracts";
import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

import { fetchEvents, toNumber } from "../../Feed/events/fetchEvents";
import { poolContracts } from "../../Pools/poolContract";
import { classifyTransfer } from "../classifyTransfer";
import { TxProps } from "../types";

const POOL_TYPE_BY_ADDRESS: Record<string, number> = Object.fromEntries(
  Object.entries(poolContracts).map(([type, pool]) => [pool.address.toLowerCase(), Number(type)])
);

/** RC transfers sent and received by the address, newest first. */
async function getTransfers(rpc: string, address: string): Promise<TxProps[]> {
  const [sent, received] = await Promise.all([
    fetchEvents(rpc, RegenerationCredit, "Transfer", { from: address }),
    fetchEvents(rpc, RegenerationCredit, "Transfer", { to: address }),
  ]);

  const byKey = new Map<string, TxProps>();
  for (const event of [...sent, ...received]) {
    const from = String(event.returnValues.from);
    const to = String(event.returnValues.to);
    const { kind, poolType } = classifyTransfer(from, to, address, POOL_TYPE_BY_ADDRESS);
    byKey.set(`${event.transactionHash}-${event.logIndex}`, {
      coin: "RC",
      type: kind === "receive" || kind === "poolWithdraw" ? "RECEIVE" : "TRANSFER",
      kind,
      poolType,
      blockNumber: toNumber(event.blockNumber),
      hash: event.transactionHash ?? "",
      from,
      to,
      value: toNumber(event.returnValues.value),
    });
  }

  return [...byKey.values()].sort((a, b) => b.blockNumber - a.blockNumber);
}

export function useTransfers({ address }: { address?: string }) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [QueryKeys.Transfers, address],
    queryFn: () => getTransfers(rpc, address as string),
    enabled: !!address,
  });

  return { txs: data ?? [], isLoading: !!address && isLoading, refetch, isRefetching };
}
