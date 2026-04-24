import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { SupporterRules } from "@contracts";
import { useTxContext } from "@hooks";

export function useDeclareReductionCommitment() {
  const { provider: ethereum } = useSDK();
  const { sendTransaction } = useTxContext();

  async function declareReductionCommitment(calculatorItemId: number) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    try {
      sendTransaction({
        interactWithContract: true,
        contractAbi: SupporterRules.abi,
        contractAddress: SupporterRules.address,
        methodName: 'declareReductionCommitment',
        params: [calculatorItemId]
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error declaring commitment',
        text2: String(error)
      });
    }
  }

  return { declareReductionCommitment };
}