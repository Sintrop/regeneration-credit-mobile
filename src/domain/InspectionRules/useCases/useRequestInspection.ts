import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface ReturnUseRequestInspection {
  hash: string;
  requestInspection: () => void;
}
export function useRequestInspection(): ReturnUseRequestInspection {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleRequest() {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: InspectionRules.abi,
      contractAddress: InspectionRules.address,
      methodName: 'requestInspection',
      params: []
    })
  }

  return {
    hash: '',
    requestInspection: handleRequest
  }
}
