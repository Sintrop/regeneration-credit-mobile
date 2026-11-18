/**
 * MetaMask Connect gives up on a request after 60 seconds. On iOS the app is
 * suspended while the user approves in MetaMask, so a transaction that was sent
 * can still come back as a timeout. These helpers look for it on-chain instead.
 */

export type RpcCall = (method: string, params: unknown[]) => Promise<unknown>;

interface ChainTx {
  hash: string;
  from: string;
  nonce: string;
}

const MAX_BLOCKS_TO_SCAN = 500;

export function createRpcCall(rpcUrl: string): RpcCall {
  return async (method, params) => {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    const data = await response.json() as { result?: unknown; error?: { message: string } };
    if (data.error) throw new Error(data.error.message);
    return data.result;
  };
}

/** Nonce the account's next transaction will use, and the current block. */
export async function getSendStart(rpc: RpcCall, from: string): Promise<{ nonce: number; block: number }> {
  const [nonce, block] = await Promise.all([
    rpc('eth_getTransactionCount', [from, 'pending']),
    rpc('eth_blockNumber', []),
  ]);
  return { nonce: parseInt(nonce as string, 16), block: parseInt(block as string, 16) };
}

/** Hash of the mined transaction sent by `from` with `nonce`, searched from the newest block down to `fromBlock`. */
export async function findMinedTransaction(
  rpc: RpcCall,
  from: string,
  nonce: number,
  fromBlock: number,
): Promise<string | undefined> {
  const latest = parseInt(await rpc('eth_blockNumber', []) as string, 16);
  const lowest = Math.max(fromBlock, latest - MAX_BLOCKS_TO_SCAN);
  const sender = from.toLowerCase();

  for (let number = latest; number >= lowest; number--) {
    const block = await rpc('eth_getBlockByNumber', ['0x' + number.toString(16), true]) as
      { transactions?: ChainTx[] } | null;
    const match = block?.transactions?.find(tx =>
      tx.from?.toLowerCase() === sender && parseInt(tx.nonce, 16) === nonce,
    );
    if (match) return match.hash;
  }
  return undefined;
}

/**
 * Waits until the account's transaction with `nonce` is mined and resolves with its hash,
 * or with undefined when it does not show up in time (or `isCancelled` turns true).
 */
export async function waitForSentTransaction(
  rpc: RpcCall,
  from: string,
  start: { nonce: number; block: number },
  {
    timeoutMs = 120_000,
    intervalMs = 4_000,
    isCancelled = () => false,
    sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),
  }: {
    timeoutMs?: number;
    intervalMs?: number;
    isCancelled?: () => boolean;
    sleep?: (ms: number) => Promise<void>;
  } = {},
): Promise<string | undefined> {
  for (let waited = 0; waited <= timeoutMs; waited += intervalMs) {
    if (isCancelled()) return undefined;
    try {
      const mined = parseInt(await rpc('eth_getTransactionCount', [from, 'latest']) as string, 16);
      if (mined > start.nonce) {
        return await findMinedTransaction(rpc, from, start.nonce, start.block);
      }
    } catch {
      // A failed read only delays the next check.
    }
    await sleep(intervalMs);
  }
  return undefined;
}

/** Errors where the wallet may still have sent the transaction. */
export function isLostWalletResponse(error: unknown): boolean {
  const err = error as { name?: string; message?: string };
  return err?.name === 'TransportTimeoutError' || /timed? ?out|timeout/i.test(err?.message ?? '');
}
