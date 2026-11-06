export type TransferKind = "receive" | "send" | "poolWithdraw" | "burn";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** Classifies an RC Transfer from the connected user's point of view. */
export function classifyTransfer(
  from: string,
  to: string,
  address: string,
  poolTypeByAddress: Record<string, number>,
): { kind: TransferKind; poolType?: number } {
  const me = address.toLowerCase();
  if (to.toLowerCase() === ZERO_ADDRESS && from.toLowerCase() === me) return { kind: "burn" };
  const poolType = poolTypeByAddress[from.toLowerCase()];
  if (poolType && to.toLowerCase() === me) return { kind: "poolWithdraw", poolType };
  return { kind: from.toLowerCase() === me ? "send" : "receive" };
}
