import { checkRpc, isValidRpcUrl } from '../src/services/rpcHealth';

function mockRpc(responses: Record<string, unknown>) {
  global.fetch = jest.fn(async (_url, init: any) => {
    const { method } = JSON.parse(init.body);
    return { ok: true, json: async () => ({ result: responses[method] }) } as any;
  }) as any;
}

describe('isValidRpcUrl', () => {
  it('accepts http(s) URLs only', () => {
    expect(isValidRpcUrl('https://rpc.sintrop.com')).toBe(true);
    expect(isValidRpcUrl('http://10.0.0.2:8545')).toBe(true);
    expect(isValidRpcUrl('rpc.sintrop.com')).toBe(false);
    expect(isValidRpcUrl('')).toBe(false);
  });
});

describe('checkRpc', () => {
  it('accepts a Sintrop RPC and reports the block', async () => {
    mockRpc({ eth_chainId: '0x3d171', eth_blockNumber: '0x10' });
    await expect(checkRpc('https://rpc.sintrop.com')).resolves.toMatchObject({ ok: true, blockNumber: 16 });
  });

  it('rejects an RPC of another network', async () => {
    mockRpc({ eth_chainId: '0x1', eth_blockNumber: '0x10' });
    await expect(checkRpc('https://eth.example')).resolves.toEqual({ ok: false, error: 'wrongChain' });
  });

  it('reports unreachable RPCs', async () => {
    global.fetch = jest.fn(async () => { throw new Error('network'); }) as any;
    await expect(checkRpc('https://down.example')).resolves.toEqual({ ok: false, error: 'unreachable' });
  });

  it('reports a timeout', async () => {
    global.fetch = jest.fn((_url, init: any) => new Promise((_, reject) => {
      init.signal.addEventListener('abort', () => reject(new Error('aborted')));
    })) as any;
    await expect(checkRpc('https://slow.example', 20)).resolves.toEqual({ ok: false, error: 'timeout' });
  });

  it('rejects invalid URLs without calling the network', async () => {
    global.fetch = jest.fn() as any;
    await expect(checkRpc('not a url')).resolves.toEqual({ ok: false, error: 'invalidUrl' });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
