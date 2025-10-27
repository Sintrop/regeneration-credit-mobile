import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { ActivistRules } from "@contracts";
import { useTxContext } from "@hooks";

interface AddActivistProps {
  name: string;
  proofPhoto: string;
}
interface ReturnUseAddActivist {
  hash: string;
  addActivist: (data: AddActivistProps) => void;
}
export function useAddActivist(): ReturnUseAddActivist {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleAddActivist(data: AddActivistProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: ActivistRules.abi,
      contractAddress: ActivistRules.address,
      methodName: 'addActivist',
      params: [data.name, data.proofPhoto]
    })
  }

  return {
    hash: '',
    addActivist: handleAddActivist
  }
}
