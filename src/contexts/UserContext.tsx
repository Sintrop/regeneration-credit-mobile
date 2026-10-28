import { createContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Alert } from "react-native";
import { useSDK } from "@metamask/sdk-react";
import { useGetUser, useNativeBalance } from "@domain";
import { switchToSintrop } from "@services";

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
    try {
      if (!sdk) {
        showWalletNotFound();
        return;
      }

      const accounts = await sdk.connect();
      if (accounts && (accounts as string[])[0]) {
        switchToSintropChain();
      }
    } catch (e: any) {
      if (e?.message?.includes('user rejected') || e?.code === 4001) {
        return;
      }
      showWalletNotFound();
    }
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
        switchToSintropChain,
        refetchUser,
        balanceSIN
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
