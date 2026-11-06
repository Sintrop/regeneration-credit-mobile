import i18next from "i18next";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InvitationRules, ResearcherRules } from "@contracts";
import { useTxContext } from "@hooks";

import { PUBLISHER_CONTRACTS, PublisherUserType, REGISTER_METHOD } from "../publishingContracts";

const PUBLISH_METHOD: Record<PublisherUserType, string> = {
  3: "addResearch",
  4: "addReport",
  5: "addContribution",
};

/** Transactions available to researchers, developers and contributors. */
export function usePublisherTransactions(userType: PublisherUserType) {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();
  const contract = PUBLISHER_CONTRACTS[userType];

  function send(contractRef: { abi: any; address: string }, methodName: string, params: unknown[]) {
    if (!ethereum) {
      Toast.show({ type: "error", text1: i18next.t("common.walletUnavailable") });
      return;
    }
    sendTransaction({
      interactWithContract: true,
      contractAbi: contractRef.abi,
      contractAddress: contractRef.address,
      methodName,
      params,
    });
  }

  return {
    register: (name: string, proofPhoto: string) => send(contract, REGISTER_METHOD[userType], [name, proofPhoto]),
    /** Research: (title, thesis, file). Report / contribution: (description, file). */
    publish: (params: string[]) => send(contract, PUBLISH_METHOD[userType], params),
    addCalculatorItem: (item: string, thesis: string, unit: string, carbonImpact: string) =>
      send(ResearcherRules, "addCalculatorItem", [item, thesis, unit, carbonImpact]),
    addEvaluationMethod: (title: string, research: string, projectURL: string) =>
      send(ResearcherRules, "addEvaluationMethod", [title, research, projectURL]),
    invite: (address: string) => send(InvitationRules, "invite", [address, userType]),
  };
}
