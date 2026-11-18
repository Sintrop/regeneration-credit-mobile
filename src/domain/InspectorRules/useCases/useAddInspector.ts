import i18next from "i18next";
import Toast from "react-native-toast-message";

import { InspectorRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface AddInspectorProps {
  name: string;
  proofPhoto: string;
}
interface ReturnUseAddInspector {
  hash: string;
  addInspector: (data: AddInspectorProps) => void;
}
export function useAddInspector(): ReturnUseAddInspector {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleAddInspector(data: AddInspectorProps) {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: InspectorRules.abi,
      contractAddress: InspectorRules.address,
      methodName: 'addInspector',
      params: [data.name, data.proofPhoto]
    })
  }

  return {
    hash: '',
    addInspector: handleAddInspector
  }
}
