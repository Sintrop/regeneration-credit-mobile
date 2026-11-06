import i18next from "i18next";
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
        text1: i18next.t('common.walletUnavailable')
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
        text1: i18next.t('impactCalculator.errorDeclaringCommitment'),
        text2: String(error)
      });
    }
  }

  return { declareReductionCommitment };
}