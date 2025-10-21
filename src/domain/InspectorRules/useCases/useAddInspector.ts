import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { InspectorRules } from "@contracts";
import { useTxContext } from "@hooks";

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
  const { provider: ethereum } = useSDK();

  async function handleAddInspector(data: AddInspectorProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
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
