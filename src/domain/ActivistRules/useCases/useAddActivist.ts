import i18next from "i18next";
import Toast from "react-native-toast-message";

import { ActivistRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

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
  const { wallet } = useWalletContext();

  async function handleAddActivist(data: AddActivistProps) {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
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
