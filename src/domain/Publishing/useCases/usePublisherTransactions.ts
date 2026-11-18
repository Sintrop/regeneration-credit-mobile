import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InvitationRules, ResearcherRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

import { PUBLISHER_CONTRACTS, PublisherUserType, REGISTER_METHOD } from "../publishingContracts";
import { inviteWithSintrop } from "../../InvitationRules/useCases/inviteWithSintrop";
import type { SendTransactionOptions } from "@contexts";

const PUBLISH_METHOD: Record<PublisherUserType, string> = {
  3: "addResearch",
  4: "addReport",
  5: "addContribution",
};

/** Transactions available to researchers, developers and contributors. */
export function usePublisherTransactions(userType: PublisherUserType) {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();
  const contract = PUBLISHER_CONTRACTS[userType];

  function send(
    contractRef: { abi: any; address: string },
    methodName: string,
    params: unknown[],
    options?: SendTransactionOptions,
  ) {
    if (!wallet) {
      Toast.show({ type: "error", text1: i18next.t("common.walletUnavailable") });
      return;
    }
    sendTransaction({
      interactWithContract: true,
      contractAbi: contractRef.abi,
      contractAddress: contractRef.address,
      methodName,
      params,
    }, options);
  }

  return {
    register: (name: string, proofPhoto: string) => send(contract, REGISTER_METHOD[userType], [name, proofPhoto]),
    /** Research: (title, thesis, file). Report / contribution: (description, file). */
    publish: (params: string[]) => send(contract, PUBLISH_METHOD[userType], params),
    addCalculatorItem: (item: string, thesis: string, unit: string, carbonImpact: string) =>
      send(ResearcherRules, "addCalculatorItem", [item, thesis, unit, carbonImpact]),
    addEvaluationMethod: (title: string, research: string, projectURL: string) =>
      send(ResearcherRules, "addEvaluationMethod", [title, research, projectURL]),
    invite: (address: string, sintropWei?: string | null) =>
      send(InvitationRules, "invite", [address, userType], inviteWithSintrop(address, sintropWei)),
  };
}
