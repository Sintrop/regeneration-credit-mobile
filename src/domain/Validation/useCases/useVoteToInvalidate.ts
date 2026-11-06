import i18next from "i18next";
import Toast from "react-native-toast-message";

import { useTxContext, useWalletContext } from "@hooks";

import { getVoteTransaction } from "../validationService";
import { ValidationTarget } from "../voteEligibility";

export function useVoteToInvalidate() {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  function vote(target: ValidationTarget, idOrAddress: string | number, justification: string) {
    if (!wallet) {
      Toast.show({ type: "error", text1: i18next.t("common.walletUnavailable") });
      return;
    }
    const tx = getVoteTransaction(target, idOrAddress, justification);
    sendTransaction({
      interactWithContract: true,
      contractAbi: tx.contract.abi,
      contractAddress: tx.contract.address,
      methodName: tx.method,
      params: tx.params,
    });
  }

  return { vote };
}
