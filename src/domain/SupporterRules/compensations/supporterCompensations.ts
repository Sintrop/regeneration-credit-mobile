import { RegenerationCredit, SupporterRules } from "@contracts";

import { fetchEvents, toNumber } from "../../Feed/events/fetchEvents";
import { excludeOffsetBurns } from "../../Feed/events/feedEventsService";

const WEI = 10 ** 18;

export type CompensationKind = "offset" | "treeFunding";

export interface Compensation {
  kind: CompensationKind;
  amount: number;
  blockNumber: number;
  /** Offsets only: calculator item and the message left by the supporter. */
  calculatorItemId?: number;
  message?: string;
  transactionHash?: string;
}

/** Offsets (SupporterRules.OffsetMade) and direct tree-planting burns of one supporter, newest first. */
export async function getSupporterCompensations(rpc: string, address: string): Promise<Compensation[]> {
  const [offsets, certified] = await Promise.all([
    fetchEvents(rpc, SupporterRules, "OffsetMade", { supporterAddress: address }),
    fetchEvents(rpc, RegenerationCredit, "TokensCertified", { account: address }),
  ]);

  const offsetItems: Compensation[] = offsets.map(event => ({
    kind: "offset",
    amount: toNumber(event.returnValues.amountBurned) / WEI,
    blockNumber: toNumber(event.returnValues.blockNumber ?? event.blockNumber),
    calculatorItemId: toNumber(event.returnValues.calculatorItemId),
    message: String(event.returnValues.message ?? ""),
    transactionHash: event.transactionHash,
  }));

  const treeFundings: Compensation[] = excludeOffsetBurns(certified, offsets).map(event => ({
    kind: "treeFunding",
    amount: toNumber(event.returnValues.amount) / WEI,
    blockNumber: toNumber(event.blockNumber),
    transactionHash: event.transactionHash,
  }));

  return [...offsetItems, ...treeFundings].sort((a, b) => b.blockNumber - a.blockNumber);
}
