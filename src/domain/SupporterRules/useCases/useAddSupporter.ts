import i18next from "i18next";
import { Alert } from "react-native";

import { SupporterRules } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface AddSupporterProps {
  name: string;
  description: string;
  profilePhoto: string;
}
interface ReturnUseAddSupporter {
  hash: string;
  addSupporter: (data: AddSupporterProps) => void;
}
export function useAddSupporter(): ReturnUseAddSupporter {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();

  async function handleAddSupporter(data: AddSupporterProps) {
    if (!wallet) {
      Alert.alert(i18next.t('market.error'), i18next.t('common.walletUnavailable'));
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: SupporterRules.abi,
      contractAddress: SupporterRules.address,
      methodName: 'addSupporter',
      params: [data.name, data.description, data.profilePhoto]
    })
  }

  return {
    hash: '',
    addSupporter: handleAddSupporter
  }
}
