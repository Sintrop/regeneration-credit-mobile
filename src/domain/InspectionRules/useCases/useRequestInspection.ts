import i18next from "i18next";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext } from "@hooks";

interface ReturnUseRequestInspection {
  hash: string;
  requestInspection: () => void;
}
export function useRequestInspection(): ReturnUseRequestInspection {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleRequest() {
    if (!ethereum) {
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
