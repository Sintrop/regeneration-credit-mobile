import { createContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useGetUser, useNativeBalance } from "@domain";
import { useWalletContext } from "@hooks";
import { isLostWalletResponse, isPendingConnection, isUserRejection, selectSintrop } from "@services";

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
  handleConnectWithQrCode: () => void;
  handleDisconnect: () => void;
  addSintropNetwork: () => void;
  switchToSintropChain: () => void;
  refetchUser: () => void;
}

export const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
  const {
    wallet,
    account,
    isConnected,
    connecting,
    connect,
    connectWithQrCode,
    addSintropNetwork: addNetwork,
    disconnect,
  } = useWalletContext();
  const { t } = useTranslation();
  const { userType, refetch: refetchUserType } = useGetUser({ address: account as string })
  const { balance: balanceSIN, refetch: refetchBalanceSIN } = useNativeBalance(account as string);

  function showConnectionError(error: unknown) {
    if (isUserRejection(error)) return;
    if (isLostWalletResponse(error)) {
      Toast.show({
        type: 'info',
        text1: t('wallet.connectionSlowTitle'),
        text2: t('wallet.connectionSlow'),
      });
      return;
    }
    Toast.show({
      type: 'error',
      text1: t('wallet.connectionFailed'),
    });
  }

  async function handleConnect() {
    try {
      await connect();
    } catch (error) {
      showConnectionError(error);
    }
  }

  async function handleConnectWithQrCode() {
    try {
      await connectWithQrCode();
    } catch (error) {
      showConnectionError(error);
    }
  }

  async function addSintropNetwork() {
    try {
      await addNetwork();
    } catch (error) {
      if (isUserRejection(error) || isPendingConnection(error)) return;
      Toast.show({
        type: 'error',
        text1: t('wallet.addNetworkFailed'),
      });
    }
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
          onPress: () => { disconnect().catch(() => {}); },
        },
      ]
    );
  }

  async function switchToSintropChain() {
    if (!wallet) return;
    await selectSintrop(wallet);
  }

  function refetchUser() {
    refetchUserType();
    refetchBalanceSIN();
  }

  return (
    <UserContext.Provider
      value={{
        address: account as string,
        isConnected,
        connecting,
        userType,
        handleConnect,
        handleConnectWithQrCode,
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
