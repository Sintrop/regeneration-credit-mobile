import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface AcceptInspectionProps {
  inspectionId: number;
}
interface ReturnUseAcceptInspection {
  hash: string;
  acceptInspection: (data: AcceptInspectionProps) => void;
}
export function useAcceptInspection(): ReturnUseAcceptInspection {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleAccept(data: AcceptInspectionProps) {
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
      methodName: 'acceptInspection',
      params: [data.inspectionId]
    })
  }

  return {
    hash: '',
    acceptInspection: handleAccept
  }
}
