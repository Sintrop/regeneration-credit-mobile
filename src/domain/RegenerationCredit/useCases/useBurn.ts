import i18next from "i18next";
import Toast from "react-native-toast-message";

import { RegenerationCredit } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface BurnProps {
  value: string;
}
interface ReturnUseBurn {
  hash: string;
  burnTokens: (data: BurnProps) => void;
}
export function useBurn(): ReturnUseBurn {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleBurn(data: BurnProps) {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
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
