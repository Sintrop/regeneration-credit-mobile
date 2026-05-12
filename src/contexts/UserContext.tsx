import { createContext, ReactNode } from "react";
import { Linking, Alert } from "react-native";
import { useSDK } from "@metamask/sdk-react";
import { useGetUser } from "@domain";

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
  sendTransaction: () => void;
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
    balance,
  } = useSDK();
  const { userType, refetch: refetchUserType } = useGetUser({ address: account })
  const balanceSIN = balance ? parseInt(balance, 16) / 10 ** 18 : 0;

  async function handleConnect() {
    try {
      // Check if SDK is available
      if (!sdk) {
        Alert.alert(
          "Carteira não encontrada",
          "Para conectar, você precisa ter uma carteira Web3 instalada como MetaMask. Deseja instalar o MetaMask?",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Instalar", 
              onPress: () => Linking.openURL("https://metamask.io/download/") 
            },
          ]
        );
        return;
      }
      
      const accounts = await sdk.connect();
      if (accounts && (accounts as string[])[0]) {
        console.log((accounts as string[])[0]);
        switchToSintropChain();
      } else {
        // User cancelled or no accounts returned
        console.log('No accounts returned or user cancelled');
      }
    } catch (e: any) {
      console.log('ERROR', e);
      // Check if it's a "user rejected" error
      if (e?.message?.includes('user rejected') || e?.code === 4001) {
        // User cancelled, do nothing
        return;
      }
      // For any other error (including no MetaMask), show instructions
      Alert.alert(
        "Carteira não encontrada",
        "Para conectar, você precisa ter uma carteira Web3 instalada como MetaMask. Deseja instalar o MetaMask?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Instalar", 
            onPress: () => Linking.openURL("https://metamask.io/download/") 
          },
        ]
      );
    }
  }

  async function switchToSintropChain() {
    try {
      const result = await ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x3D171',
          },
        ],
      });
      console.log('exampleRequest', result);
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  const sendTransaction = async () => {
    const to = '0x0000000000000000000000000000000000000000';
    const transactionParameters = {
      to, // Required except during contract publications.
      from: ethereum?.getSelectedAddress(), // must match user's active address.
      value: '0x5AF3107A4000', // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await ethereum?.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log(txHash);
    } catch (e) {
      console.log(e);
    }
  };

  function refetchUser() {
    refetchUserType();
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
        sendTransaction,
        refetchUser,
        balanceSIN
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
