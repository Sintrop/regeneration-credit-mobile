import {
  SINTROP_CHAIN_ID,
  SINTROP_CHAIN_PARAMS,
  SintropWallet,
  addSintrop,
  isSintropChain,
  isUserRejection,
  selectSintrop,
  sendTransactionOnSintrop,
} from '../src/services/sintropChain';

type Handler = (params?: unknown) => unknown;

function rpcError(code: number) {
  return Object.assign(new Error(`rpc error ${code}`), { code });
}

function createWallet({
  chainId = '0x1',
  switchChain = async () => {},
  handlers = {},
}: {
  chainId?: string;
  switchChain?: SintropWallet['switchChain'];
  handlers?: Record<string, Handler>;
}) {
  const request = jest.fn(async ({ method, params }: { method: string; params?: unknown }) => {
    const handler = handlers[method];
    if (!handler) throw new Error(`unexpected ${method}`);
    return handler(params);
  });
  const wallet = {
    getChainId: () => chainId,
    switchChain: jest.fn(switchChain),
    getProvider: () => ({ request }),
  };
  return { wallet, request };
}

describe('isSintropChain', () => {
  it('matches the Sintrop chain id in any case', () => {
    expect(isSintropChain('0x3D171')).toBe(true);
    expect(isSintropChain('0x3d171')).toBe(true);
    expect(isSintropChain('0x1')).toBe(false);
    expect(isSintropChain(undefined)).toBe(false);
  });
});

describe('isUserRejection', () => {
  it('recognises the rejection in the forms MetaMask Connect delivers it', () => {
    expect(isUserRejection(rpcError(4001))).toBe(true);
    expect(isUserRejection({ code: 53, rpcCode: 4001 })).toBe(true);
    expect(isUserRejection({ code: -32603, data: { originalError: { code: 4001 } } })).toBe(true);
    expect(isUserRejection(new Error('User rejected the request.'))).toBe(true);
  });

  it('does not treat other errors as a rejection', () => {
    expect(isUserRejection(rpcError(4902))).toBe(false);
    expect(isUserRejection(new Error('network down'))).toBe(false);
    expect(isUserRejection(undefined)).toBe(false);
  });
});

describe('addSintrop', () => {
  it('asks the wallet to add the Sintrop network', async () => {
    const { wallet, request } = createWallet({ handlers: { wallet_addEthereumChain: () => null } });
    await addSintrop(wallet);
    expect(request).toHaveBeenCalledWith({
      method: 'wallet_addEthereumChain',
      params: [SINTROP_CHAIN_PARAMS],
    });
  });
});

describe('selectSintrop', () => {
  it('does nothing when Sintrop is already selected', async () => {
    const { wallet } = createWallet({ chainId: SINTROP_CHAIN_ID });
    await expect(selectSintrop(wallet)).resolves.toBe(true);
    expect(wallet.switchChain).not.toHaveBeenCalled();
  });

  it('switches with the network data, so an unknown network gets added', async () => {
    const { wallet } = createWallet({});
    await expect(selectSintrop(wallet)).resolves.toBe(true);
    expect(wallet.switchChain).toHaveBeenCalledWith({
      chainId: SINTROP_CHAIN_ID,
      chainConfiguration: SINTROP_CHAIN_PARAMS,
    });
  });

  it('adds the network directly when the switch fails for another reason', async () => {
    const { wallet, request } = createWallet({
      switchChain: async () => { throw rpcError(-32603); },
      handlers: { wallet_addEthereumChain: () => null },
    });
    await expect(selectSintrop(wallet)).resolves.toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('stops when the user rejects the switch', async () => {
    const { wallet, request } = createWallet({
      switchChain: async () => { throw rpcError(4001); },
    });
    await expect(selectSintrop(wallet)).resolves.toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it('fails when the network can be neither selected nor added', async () => {
    const { wallet } = createWallet({
      switchChain: async () => { throw rpcError(4902); },
      handlers: { wallet_addEthereumChain: () => { throw rpcError(4001); } },
    });
    await expect(selectSintrop(wallet)).resolves.toBe(false);
  });
});

describe('sendTransactionOnSintrop', () => {
  const tx = { from: '0xabc', to: '0xdef', data: '0x' };

  it('sends directly when Sintrop is selected', async () => {
    const { wallet, request } = createWallet({
      chainId: SINTROP_CHAIN_ID,
      handlers: { eth_sendTransaction: () => '0xhash' },
    });
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash');
    expect(request).toHaveBeenCalledWith({ method: 'eth_sendTransaction', params: [tx] });
    expect(wallet.switchChain).not.toHaveBeenCalled();
  });

  it('selects Sintrop before sending when another network is selected', async () => {
    const { wallet } = createWallet({ handlers: { eth_sendTransaction: () => '0xhash' } });
    await expect(sendTransactionOnSintrop(wallet, tx)).resolves.toBe('0xhash');
    expect(wallet.switchChain).toHaveBeenCalledTimes(1);
  });

  it('does not send when the wallet stays on another network', async () => {
    const { wallet, request } = createWallet({
      switchChain: async () => { throw rpcError(4001); },
    });
    await expect(sendTransactionOnSintrop(wallet, tx)).rejects.toThrow('Sintrop network');
    expect(request).not.toHaveBeenCalled();
  });

  it('propagates a rejected transaction', async () => {
    const { wallet } = createWallet({
      chainId: SINTROP_CHAIN_ID,
      handlers: { eth_sendTransaction: () => { throw rpcError(4001); } },
    });
    await expect(sendTransactionOnSintrop(wallet, tx)).rejects.toMatchObject({ code: 4001 });
  });
});
