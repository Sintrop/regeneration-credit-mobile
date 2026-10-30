import { createContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Alert } from "react-native";
import { useSDK } from "@metamask/sdk-react";
import { useGetUser, useNativeBalance } from "@domain";
import { SINTROP_CHAIN_PARAMS, isUserRejection, switchToSintrop } from "@services";

export interface UserProviderProps {
  children: ReactNode;
}

export interface UserContextProps {
  address: string;
  isConnected: boolean;
  connecting: boolean;
  userType: number;
  balanceSIN: number;
  handleConnect: () => void;
  handleDisconnect: () => void;
  addSintropNetwork: () => void;
  switchToSintropChain: () => void;
  refetchUser: () => void;
}

export const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
  const {
    sdk,
    provider: ethereum,
    account,
    connected,
    connecting,
  } = useSDK();
  const { t } = useTranslation();
  const { userType, refetch: refetchUserType } = useGetUser({ address: account })
  const { balance: balanceSIN, refetch: refetchBalanceSIN } = useNativeBalance(account);

  function showWalletNotFound() {
    Alert.alert(
      t('common.walletNotFound'),
      t('common.walletNotFoundDescription'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.install'),
          onPress: () => Linking.openURL("https://metamask.io/download/")
        },
      ]
    );
  }

  async function handleConnect() {
    if (!sdk) {
      showWalletNotFound();
      return;
    }

    // Connects and adds/selects the Sintrop network in a single trip to the wallet.
    try {
      await sdk.connectWith({ method: 'wallet_addEthereumChain', params: [SINTROP_CHAIN_PARAMS] });
      return;
    } catch (e: any) {
      if (isUserRejection(e) || e?.message?.includes('user rejected')) return;
    }

    // Wallets without connectWith support: connect, then switch network.
    try {
      const accounts = await sdk.connect();
      if (accounts && (accounts as string[])[0]) {
        switchToSintropChain();
      }
    } catch (e: any) {
      if (isUserRejection(e) || e?.message?.includes('user rejected')) return;
      showWalletNotFound();
    }
  }

  /** Adds and selects Sintrop in the wallet, connecting first in the same trip when needed. */
  async function addSintropNetwork() {
    if (connected) {
      await switchToSintropChain();
      return;
    }
    await handleConnect();
  }

  function handleDisconnect() {
    Alert.alert(
      t('settings.disconnectTitle'),
      t('settings.disconnectMessage'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('settings.disconnect'),
          style: "destructive",
          onPress: () => { sdk?.terminate().catch(() => {}); },
        },
      ]
    );
  }

  async function switchToSintropChain() {
    if (!ethereum) return;
    await switchToSintrop(ethereum);
  }

  function refetchUser() {
    refetchUserType();
    refetchBalanceSIN();
  }

  return (
    <UserContext.Provider
      value={{ 
        address: account as string, 
        isConnected: connected, 
        connecting,
        userType,
        handleConnect, 
        handleDisconnect,
        addSintropNetwork,
        switchToSintropChain,
        refetchUser,
        balanceSIN
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
