import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { RegenerationCredit } from "@contracts";
import { useTxContext } from "@hooks";

interface BurnProps {
  value: number;
}
interface ReturnUseBurn {
  hash: string;
  burnTokens: (data: BurnProps) => void;
}
export function useBurn(): ReturnUseBurn {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleBurn(data: BurnProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: RegenerationCredit.abi,
      contractAddress: RegenerationCredit.address,
      methodName: 'burnTokens',
      params: [data.value]
    })
  }

  return {
    hash: '',
    burnTokens: handleBurn
  }
}
