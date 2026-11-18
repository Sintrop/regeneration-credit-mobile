import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InvitationRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";
import { inviteWithSintrop } from "./inviteWithSintrop";

interface InviteProps {
  address: string;
  userType: number;
  /** SINTROP (in wei) sent to the invited wallet right after the invite, so it can pay the registration fee. */
  sintropWei?: string | null;
}
interface ReturnUseInvite {
  hash: string;
  invite: (data: InviteProps) => void;
}
export function useInvite(): ReturnUseInvite {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleInvite(data: InviteProps) {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
      });
      return;
    }

    const methodName = data.userType === 1 || data.userType === 2 ? 'inviteRegeneratorInspector' : 'invite';
    sendTransaction(
      {
        interactWithContract: true,
        contractAbi: InvitationRules.abi,
        contractAddress: InvitationRules.address,
        methodName,
        params: [data.address, data.userType]
      },
      inviteWithSintrop(data.address, data.sintropWei),
    )
  }

  return {
    hash: '',
    invite: handleInvite
  }
}
