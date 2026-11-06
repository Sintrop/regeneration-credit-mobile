import i18next from "i18next";
import Toast from "react-native-toast-message";

import { RegeneratorRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

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
  const { wallet } = useWalletContext();

  async function handleAddRegenerator(data: AddRegeneratorProps) {
    if (!wallet) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
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
