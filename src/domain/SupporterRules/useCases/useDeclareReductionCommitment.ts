import i18next from "i18next";
import Toast from "react-native-toast-message";

import { SupporterRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

export function useDeclareReductionCommitment() {
  const { wallet } = useWalletContext();
  const { sendTransaction } = useTxContext();

  async function declareReductionCommitment(calculatorItemId: number) {
    if (!wallet) {
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