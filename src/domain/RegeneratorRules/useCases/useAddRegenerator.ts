import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { RegeneratorRules } from "@contracts";
import { useTxContext } from "@hooks";

import { CoordinateProps } from "../types";
import { regeneratorAdapter } from "../regeneratorAdapter";

interface AddRegeneratorProps {
  name: string;
  proofPhoto: string;
  totalArea: number;
  projectDescription: string;
  coordinates: CoordinateProps[];
}
interface ReturnUseAddRegenerator {
  hash: string;
  addRegenerator: (data: AddRegeneratorProps) => void;
}
export function useAddRegenerator(): ReturnUseAddRegenerator {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleAddRegenerator(data: AddRegeneratorProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    const coordinates = data.coordinates.map(regeneratorAdapter.parseCoordinateToRegister);

    sendTransaction({
      interactWithContract: true,
      contractAbi: RegeneratorRules.abi,
      contractAddress: RegeneratorRules.address,
      methodName: 'addRegenerator',
      params: [data.totalArea, data.name, data.proofPhoto, data.projectDescription, coordinates]
    })
  }

  return {
    hash: '',
    addRegenerator: handleAddRegenerator
  }
}
