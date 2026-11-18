import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { Alert, AppState, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import type { MetamaskConnectEVM } from "@metamask/connect-evm";

import {
  SINTROP_CHAIN_ID,
  WalletLinkMode,
  addSintrop,
  forgetWalletSession,
  getWalletClient,
  isSintropChain,
  isPendingConnection,
  markSessionUsed,
  onWalletAppMissing,
  setLinkMode,
} from "@services";
import { WalletQrModal } from "@components";

interface WalletProviderProps {
  children: ReactNode;
}

export interface WalletContextProps {
  /** MetaMask Connect client, available once it has restored any saved session. */
  wallet?: MetamaskConnectEVM;
  account?: string;
  chainId?: string;
  isConnected: boolean;
  connecting: boolean;
  linkMode: WalletLinkMode;
  /** Connects to MetaMask on this phone and selects (or adds) the Sintrop network. */
  connect: () => Promise<void>;
  /** Shows a QR code to connect MetaMask installed on another phone. */
  connectWithQrCode: () => Promise<void>;
  /** Asks MetaMask to add and select Sintrop, connecting first when needed. */
  addSintropNetwork: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const WalletContext = createContext({} as WalletContextProps);

export function WalletProvider({ children }: WalletProviderProps) {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState<MetamaskConnectEVM>();
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<string>();
  const [connecting, setConnecting] = useState(false);
  const [linkMode, setLinkModeState] = useState<WalletLinkMode>('device');
  const [qrVisible, setQrVisible] = useState(false);
  const [pairingUri, setPairingUri] = useState<string>();
  // Each connection attempt gets an id, so a cancelled attempt that settles later changes nothing.
  const attemptRef = useRef(0);
  const tRef = useRef(t);
  tRef.current = t;
  const sessionRef = useRef({ account, linkMode });
  sessionRef.current = { account, linkMode };

  // Leaving the app (to approve in MetaMask, for instance) refreshes the window
  // in which a reopen keeps the connection. QR sessions are never kept.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      const session = sessionRef.current;
      if (state !== 'active' && session.account && session.linkMode === 'device') {
        markSessionUsed();
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let mounted = true;
    let removeListeners: (() => void) | undefined;

    const onAccountsChanged = (accounts: string[]) => {
      if (mounted) setAccount(accounts[0]);
    };
    const onChainChanged = (id: string) => {
      if (mounted) setChainId(id);
    };
    const onConnect = (data: { accounts: string[]; chainId: string }) => {
      if (!mounted) return;
      setAccount(data.accounts[0]);
      setChainId(data.chainId);
    };
    const onDisconnect = () => {
      if (!mounted) return;
      setAccount(undefined);
      setChainId(undefined);
    };
    const onDisplayUri = (uri: string) => {
      if (mounted) setPairingUri(uri);
    };

    onWalletAppMissing(() => {
      attemptRef.current += 1;
      setConnecting(false);
      getWalletClient().then(startFresh).catch(() => {});
      showWalletNotFound(tRef.current);
    });

    (async () => {
      try {
        const client = await getWalletClient();
        if (!mounted) return;
        const provider = client.getProvider();
        provider.on('accountsChanged', onAccountsChanged);
        provider.on('chainChanged', onChainChanged);
        provider.on('connect', onConnect);
        provider.on('disconnect', onDisconnect);
        provider.on('display_uri', onDisplayUri);
        removeListeners = () => {
          provider.off('accountsChanged', onAccountsChanged);
          provider.off('chainChanged', onChainChanged);
          provider.off('connect', onConnect);
          provider.off('disconnect', onDisconnect);
          provider.off('display_uri', onDisplayUri);
        };
        setAccount(client.getAccount());
        setChainId(client.getChainId());
        setWallet(client);
      } catch {
        // Connecting retries the client creation and reports the failure to the user.
      }
    })();

    return () => {
      mounted = false;
      removeListeners?.();
      onWalletAppMissing(undefined);
    };
  }, []);

  function changeLinkMode(mode: WalletLinkMode) {
    setLinkModeState(mode);
    setLinkMode(mode);
  }

  async function connect() {
    const attempt = ++attemptRef.current;
    setConnecting(true);
    try {
      const client = await getWalletClient();
      if (!client.getAccount()) await startFresh(client);
      changeLinkMode('device');
      const result = await requestConnection(client);
      if (attempt !== attemptRef.current) return;
      await markSessionUsed();
      await addSintropIfMissing(client, result.chainId);
    } finally {
      if (attempt === attemptRef.current) setConnecting(false);
    }
  }

  async function connectWithQrCode() {
    const attempt = ++attemptRef.current;
    setPairingUri(undefined);
    setQrVisible(true);
    setConnecting(true);
    try {
      const client = await getWalletClient();
      // A fresh session makes the library issue a new pairing request for the QR code.
      await startFresh(client);
      changeLinkMode('remote');
      const result = await requestConnection(client);
      if (attempt !== attemptRef.current) return;
      setQrVisible(false);
      await addSintropIfMissing(client, result.chainId);
    } catch (error) {
      if (attempt !== attemptRef.current) return;
      setQrVisible(false);
      changeLinkMode('device');
      throw error;
    } finally {
      if (attempt === attemptRef.current) setConnecting(false);
    }
  }

  /**
   * MetaMask only grants networks it already has, so a session that came back
   * without Sintrop means the network is missing: ask to add it right away
   * (adding also selects it), instead of a switch the wallet would refuse.
   */
  async function addSintropIfMissing(client: MetamaskConnectEVM, connectedChainId?: string) {
    if (isSintropChain(connectedChainId)) return;
    try {
      await addSintrop(client);
    } catch {
      // Declined or failed: the Help button and the first transaction ask again.
    }
  }

  function cancelQrConnection() {
    attemptRef.current += 1;
    setQrVisible(false);
    setConnecting(false);
    setPairingUri(undefined);
    getWalletClient().then(startFresh).catch(() => {});
    changeLinkMode('device');
  }

  async function addSintropNetwork() {
    const client = await getWalletClient();
    if (!client.getAccount()) {
      // Connecting already asks to add Sintrop when the wallet does not have it.
      await connect();
      return;
    }
    await addSintrop(client);
  }

  /** The app shows the wallet disconnected right away; the session ends in the background. */
  async function disconnect() {
    attemptRef.current += 1;
    setAccount(undefined);
    setChainId(undefined);
    setConnecting(false);
    changeLinkMode('device');
    const client = await getWalletClient();
    await startFresh(client);
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        account,
        chainId,
        isConnected: !!account,
        connecting,
        linkMode,
        connect,
        connectWithQrCode,
        addSintropNetwork,
        disconnect,
      }}
    >
      {children}
      <WalletQrModal visible={qrVisible} uri={pairingUri} onCancel={cancelQrConnection} />
    </WalletContext.Provider>
  );
}

/** Ending a session may wait on the relay; never let that hold a new connection for long. */
const RESET_WAIT_MS = 3000;

/** Ends the current session and erases leftover pairings, so the next request starts clean. */
async function startFresh(client: MetamaskConnectEVM): Promise<void> {
  await Promise.race([
    client.disconnect().catch(() => {}),
    new Promise<void>(resolve => setTimeout(resolve, RESET_WAIT_MS)),
  ]);
  await forgetWalletSession();
}

/**
 * The library refuses a new connection while it considers an earlier one pending
 * (a request left unanswered or an unfinished pairing): clear it and ask again.
 */
async function requestConnection(client: MetamaskConnectEVM) {
  try {
    return await client.connect({ chainIds: [SINTROP_CHAIN_ID] });
  } catch (error) {
    if (!isPendingConnection(error)) throw error;
    await startFresh(client);
    return await client.connect({ chainIds: [SINTROP_CHAIN_ID] });
  }
}

function showWalletNotFound(t: (key: string) => string) {
  Alert.alert(
    t('common.walletNotFound'),
    t('common.walletNotFoundDescription'),
    [
      { text: t('common.cancel'), style: "cancel" },
      {
        text: t('common.install'),
        onPress: () => Linking.openURL("https://metamask.io/download/"),
      },
    ]
  );
}
