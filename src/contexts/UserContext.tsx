import { createContext, ReactNode } from "react";
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
      const accounts = (await sdk?.connect()) as string[];
      console.log(accounts[0]);
      switchToSintropChain();
    } catch (e) {
      console.log('ERROR', e);
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
