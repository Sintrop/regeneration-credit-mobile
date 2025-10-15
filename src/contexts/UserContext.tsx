import { createContext, ReactNode, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";

export interface UserProviderProps {
  children: ReactNode;
}

export interface UserContextProps {
  address: string;
  isConnected: boolean;
  connecting: boolean;
  handleConnect: () => void;
  addOrSwitchToSintropChain: () => void;
  sendTransaction: () => void;
}

export const UserContext = createContext({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
  const {
    sdk,
    provider: ethereum,
    account,
    connected,
    connecting
  } = useSDK();

  useEffect(() => {
    console.log(ethereum)
  }, [ethereum])

  async function handleConnect() {
    try {
      const accounts = (await sdk?.connect()) as string[];
      console.log(accounts[0]);
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  async function addOrSwitchToSintropChain() {
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

  return (
    <UserContext.Provider
      value={{ 
        address: account as string, 
        isConnected: connected, 
        connecting,
        handleConnect, 
        addOrSwitchToSintropChain,
        sendTransaction
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
