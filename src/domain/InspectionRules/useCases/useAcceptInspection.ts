import i18next from "i18next";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext } from "@hooks";

interface AcceptInspectionProps {
  inspectionId: number;
}
interface ReturnUseAcceptInspection {
  hash: string;
  acceptInspection: (data: AcceptInspectionProps) => void;
}
export function useAcceptInspection(): ReturnUseAcceptInspection {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleAccept(data: AcceptInspectionProps) {
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
      methodName: 'acceptInspection',
      params: [data.inspectionId]
    })
  }

  return {
    hash: '',
    acceptInspection: handleAccept
  }
}
