import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InspectionRules } from "@contracts";
import { useTxContext } from "@hooks";

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
  const { provider: ethereum } = useSDK();

  async function handleRealize(data: RealizeInspectionProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
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
