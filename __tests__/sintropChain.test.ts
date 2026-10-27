import {
  SINTROP_CHAIN_PARAMS,
  ensureSintropChain,
  isSintropChain,
  switchToSintrop,
} from '../src/services/sintropChain';

type Handler = (params?: unknown[]) => unknown;

function createWallet(handlers: Record<string, Handler>) {
  const request = jest.fn(async ({ method, params }: { method: string; params?: unknown[] }) => {
    const handler = handlers[method];
    if (!handler) throw new Error(`unexpected ${method}`);
    return handler(params);
  });
  return { request };
}

function rpcError(code: number) {
  return Object.assign(new Error(`rpc error ${code}`), { code });
}

describe('isSintropChain', () => {
  it('matches the Sintrop chain id in any case', () => {
    expect(isSintropChain('0x3D171')).toBe(true);
    expect(isSintropChain('0x3d171')).toBe(true);
    expect(isSintropChain('0x1')).toBe(false);
    expect(isSintropChain(undefined)).toBe(false);
  });
});

describe('switchToSintrop', () => {
  it('switches when the wallet already knows the network', async () => {
    const wallet = createWallet({ wallet_switchEthereumChain: () => null });
    await expect(switchToSintrop(wallet)).resolves.toBe(true);
    expect(wallet.request).toHaveBeenCalledTimes(1);
  });

  it('adds the network when the wallet does not know it (4902)', async () => {
    const wallet = createWallet({
      wallet_switchEthereumChain: () => { throw rpcError(4902); },
      wallet_addEthereumChain: () => null,
    });
    await expect(switchToSintrop(wallet)).resolves.toBe(true);
    expect(wallet.request).toHaveBeenLastCalledWith({
      method: 'wallet_addEthereumChain',
      params: [SINTROP_CHAIN_PARAMS],
    });
  });

  it('does not add the network when the user rejects the switch', async () => {
    const wallet = createWallet({
      wallet_switchEthereumChain: () => { throw rpcError(4001); },
      wallet_addEthereumChain: () => null,
    });
    await expect(switchToSintrop(wallet)).resolves.toBe(false);
    expect(wallet.request).toHaveBeenCalledTimes(1);
  });
});

describe('ensureSintropChain', () => {
  it('does nothing when already on Sintrop', async () => {
    const wallet = createWallet({ eth_chainId: () => '0x3d171' });
    await expect(ensureSintropChain(wallet)).resolves.toBe(true);
    expect(wallet.request).toHaveBeenCalledTimes(1);
  });

  it('switches and confirms the new chain', async () => {
    let chainId = '0x1';
    const wallet = createWallet({
      eth_chainId: () => chainId,
      wallet_switchEthereumChain: () => { chainId = '0x3d171'; return null; },
    });
    await expect(ensureSintropChain(wallet)).resolves.toBe(true);
  });

  it('fails when the wallet stays on another chain', async () => {
    const wallet = createWallet({
      eth_chainId: () => '0x1',
      wallet_switchEthereumChain: () => { throw rpcError(4001); },
    });
    await expect(ensureSintropChain(wallet)).resolves.toBe(false);
  });
});
