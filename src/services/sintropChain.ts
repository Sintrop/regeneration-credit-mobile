export const SINTROP_CHAIN_ID = '0x3d171';

export const SINTROP_CHAIN_PARAMS = {
  chainId: SINTROP_CHAIN_ID,
  chainName: 'Sintrop',
  nativeCurrency: {
    name: 'SINTROP',
    symbol: 'SIN',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sintrop.com'],
  blockExplorerUrls: ['https://explorer.sintrop.com'],
};

const UNRECOGNIZED_CHAIN_ERROR = 4902;

interface EthereumRequester {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export function isSintropChain(chainId?: string | null): boolean {
  if (!chainId) return false;
  return chainId.toLowerCase() === SINTROP_CHAIN_ID;
}

function errorCode(error: unknown): number | undefined {
  const err = error as { code?: number; data?: { originalError?: { code?: number } } };
  return err?.code ?? err?.data?.originalError?.code;
}

/** Switches the wallet to Sintrop, adding the network first when the wallet does not know it. */
export async function switchToSintrop(ethereum: EthereumRequester): Promise<boolean> {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SINTROP_CHAIN_ID }],
    });
    return true;
  } catch (error) {
    if (errorCode(error) !== UNRECOGNIZED_CHAIN_ERROR) return false;
  }

  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [SINTROP_CHAIN_PARAMS],
    });
    return true;
  } catch {
    return false;
  }
}

/** Resolves true when the wallet is on Sintrop, switching it if needed. */
export async function ensureSintropChain(ethereum: EthereumRequester): Promise<boolean> {
  try {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (isSintropChain(chainId as string)) return true;
  } catch {
    return false;
  }

  if (!(await switchToSintrop(ethereum))) return false;

  try {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    return isSintropChain(chainId as string);
  } catch {
    return false;
  }
}
