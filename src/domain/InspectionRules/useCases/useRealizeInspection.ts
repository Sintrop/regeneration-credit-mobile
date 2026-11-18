import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface RealizeInspectionProps {
  inspectionId: number;
  proofPhotos: string;
  justificationReport: string;
  treesResult: number;
  biodiversityResult: number;
}
interface ReturnUseRealizeInspection {
  hash: string;
  realizeInspection: (data: RealizeInspectionProps) => void;
}
export function useRealizeInspection(): ReturnUseRealizeInspection {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleRealize(data: RealizeInspectionProps) {
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
      methodName: 'realizeInspection',
      params: [data.inspectionId, data.proofPhotos, data.justificationReport, data.treesResult, data.biodiversityResult]
    })
  }

  return {
    hash: '',
    realizeInspection: handleRealize
  }
}
