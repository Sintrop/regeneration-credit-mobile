import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InvitationRules } from "@contracts";
import { useTxContext } from "@hooks";

interface InviteProps {
  address: string;
  userType: number;
}
interface ReturnUseInvite {
  hash: string;
  invite: (data: InviteProps) => void;
}
export function useInvite(): ReturnUseInvite {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleInvite(data: InviteProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: InvitationRules.abi,
      contractAddress: InvitationRules.address,
      methodName: 'invite',
      params: [data.address, data.userType]
    })
  }

  return {
    hash: '',
    invite: handleInvite
  }
}
