export const SINTROP_CHAIN_ID = '0x3d171';

export const SINTROP_RPC_URL = 'https://rpc.sintrop.com';

export const SINTROP_CHAIN_PARAMS = {
  chainId: SINTROP_CHAIN_ID,
  chainName: 'Sintrop',
  nativeCurrency: {
    name: 'SINTROP',
    symbol: 'SIN',
    decimals: 18,
  },
  rpcUrls: [SINTROP_RPC_URL],
  blockExplorerUrls: ['https://explorer.sintrop.com'],
};

const USER_REJECTED_ERROR = 4001;

/** The parts of the MetaMask Connect EVM client used to reach the Sintrop network. */
export interface SintropWallet {
  getChainId: () => string | undefined;
  switchChain: (options: { chainId: `0x${string}`; chainConfiguration?: typeof SINTROP_CHAIN_PARAMS }) => Promise<void>;
  getProvider: () => {
    request: (args: { method: string; params?: unknown }) => Promise<unknown>;
  };
}

export function isSintropChain(chainId?: string | null): boolean {
  if (!chainId) return false;
  return chainId.toLowerCase() === SINTROP_CHAIN_ID;
}

/**
 * MetaMask Connect does not always surface a rejection as a top-level 4001:
 * it may come wrapped (rpcCode) or inside the original wallet error.
 */
export function isUserRejection(error: unknown): boolean {
  const err = error as {
    code?: number;
    rpcCode?: number;
    data?: { originalError?: { code?: number } };
    message?: string;
  };
  if (!err) return false;
  if (err.code === USER_REJECTED_ERROR || err.rpcCode === USER_REJECTED_ERROR) return true;
  if (err.data?.originalError?.code === USER_REJECTED_ERROR) return true;
  return /user (rejected|denied|cancel)/i.test(err.message ?? '');
}

/**
 * Asks the wallet to add the Sintrop network. When the network is already there,
 * MetaMask only selects it, so this always ends with Sintrop selected.
 */
export async function addSintrop(wallet: SintropWallet): Promise<void> {
  await wallet.getProvider().request({
    method: 'wallet_addEthereumChain',
    params: [SINTROP_CHAIN_PARAMS],
  });
}

/**
 * Resolves true when the wallet ends on Sintrop. A network already permitted in
 * the session is selected without a wallet prompt; an unknown one is added.
 */
export async function selectSintrop(wallet: SintropWallet): Promise<boolean> {
  if (isSintropChain(wallet.getChainId())) return true;

  try {
    await wallet.switchChain({ chainId: SINTROP_CHAIN_ID, chainConfiguration: SINTROP_CHAIN_PARAMS });
    return true;
  } catch (error) {
    if (isUserRejection(error)) return false;
  }

  // Wallet versions differ in how they report a missing network, so a failed
  // switch falls back to adding it directly.
  try {
    await addSintrop(wallet);
    return true;
  } catch {
    return false;
  }
}

/** Sends a transaction on Sintrop, selecting the network first when needed. Resolves with the hash. */
export async function sendTransactionOnSintrop(
  wallet: SintropWallet,
  txParams: Record<string, string>,
): Promise<string> {
  if (!(await selectSintrop(wallet))) {
    throw new Error('Wallet is not connected to the Sintrop network');
  }
  return await wallet.getProvider().request({
    method: 'eth_sendTransaction',
    params: [txParams],
  }) as string;
}
