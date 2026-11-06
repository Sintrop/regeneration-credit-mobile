import i18next from "i18next";

import type { SendTransactionOptions } from "@contexts";

/** Transaction options that add a SINTROP transfer to the invited wallet as the second step of an invite. */
export function inviteWithSintrop(invitedAddress: string, sintropWei?: string | null): SendTransactionOptions | undefined {
  if (!sintropWei) return undefined;
  return {
    label: i18next.t("invite.stepInvite"),
    followUp: {
      label: i18next.t("invite.stepSintrop"),
      tx: {
        interactWithContract: false,
        params: [{ to: invitedAddress, value: sintropWei }],
      },
    },
  };
}
