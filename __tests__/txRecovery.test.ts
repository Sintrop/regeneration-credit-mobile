import {
  RpcCall,
  findMinedTransaction,
  getSendStart,
  isLostWalletResponse,
  waitForSentTransaction,
} from '../src/services/txRecovery';

const FROM = '0xAbC0000000000000000000000000000000000001';
const hex = (n: number) => '0x' + n.toString(16);

function createChain({
  latestBlock,
  blocks = {},
  minedNonces,
}: {
  latestBlock: number;
  blocks?: Record<number, { hash: string; from: string; nonce: string }[]>;
  minedNonces: number[];
}) {
  let checks = 0;
  const rpc: RpcCall = jest.fn(async (method: string, params: unknown[]) => {
    switch (method) {
      case 'eth_blockNumber':
        return hex(latestBlock);
      case 'eth_getTransactionCount': {
        if (params[1] === 'pending') return hex(minedNonces[0]);
        const value = minedNonces[Math.min(checks, minedNonces.length - 1)];
        checks += 1;
        return hex(value);
      }
      case 'eth_getBlockByNumber':
        return { transactions: blocks[parseInt(params[0] as string, 16)] ?? [] };
      default:
        throw new Error(`unexpected ${method}`);
    }
  });
  return rpc;
}

const noSleep = async () => {};

describe('getSendStart', () => {
  it('reads the next nonce and the current block', async () => {
    const rpc = createChain({ latestBlock: 100, minedNonces: [7] });
    await expect(getSendStart(rpc, FROM)).resolves.toEqual({ nonce: 7, block: 100 });
  });
});

describe('findMinedTransaction', () => {
  it('finds the transaction by sender and nonce, ignoring case', async () => {
    const rpc = createChain({
      latestBlock: 103,
      minedNonces: [8],
      blocks: {
        102: [
          { hash: '0xother', from: '0x0000000000000000000000000000000000000009', nonce: hex(7) },
          { hash: '0xmine', from: FROM.toLowerCase(), nonce: hex(7) },
        ],
      },
    });
    await expect(findMinedTransaction(rpc, FROM, 7, 100)).resolves.toBe('0xmine');
  });

  it('does not match an older transaction of the same account', async () => {
    const rpc = createChain({
      latestBlock: 101,
      minedNonces: [8],
      blocks: { 101: [{ hash: '0xold', from: FROM, nonce: hex(6) }] },
    });
    await expect(findMinedTransaction(rpc, FROM, 7, 100)).resolves.toBeUndefined();
  });
});

describe('waitForSentTransaction', () => {
  it('resolves with the hash once the nonce is used on-chain', async () => {
    const rpc = createChain({
      latestBlock: 105,
      minedNonces: [7, 7, 8],
      blocks: { 104: [{ hash: '0xsent', from: FROM, nonce: hex(7) }] },
    });
    await expect(
      waitForSentTransaction(rpc, FROM, { nonce: 7, block: 100 }, { sleep: noSleep }),
    ).resolves.toBe('0xsent');
  });

  it('gives up when the nonce is never used', async () => {
    const rpc = createChain({ latestBlock: 105, minedNonces: [7] });
    await expect(
      waitForSentTransaction(rpc, FROM, { nonce: 7, block: 100 }, { sleep: noSleep, timeoutMs: 12_000 }),
    ).resolves.toBeUndefined();
  });

  it('stops as soon as it is cancelled', async () => {
    const rpc = createChain({ latestBlock: 105, minedNonces: [7] });
    await expect(
      waitForSentTransaction(rpc, FROM, { nonce: 7, block: 100 }, { sleep: noSleep, isCancelled: () => true }),
    ).resolves.toBeUndefined();
    expect(rpc).not.toHaveBeenCalled();
  });
});

describe('isLostWalletResponse', () => {
  it('recognises the MetaMask Connect timeout', () => {
    expect(isLostWalletResponse(Object.assign(new Error('Transport request timed out'), { name: 'TransportTimeoutError' }))).toBe(true);
    expect(isLostWalletResponse(new Error('Request timeout'))).toBe(true);
    expect(isLostWalletResponse(new Error('execution reverted'))).toBe(false);
  });
});
