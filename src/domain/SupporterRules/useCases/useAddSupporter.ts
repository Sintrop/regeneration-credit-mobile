/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Alert } from "react-native";
import { useSDK } from "@metamask/sdk-react";

import { SupporterRules } from "@contracts";
import { useTxContext } from "@hooks";

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
  const { sendTransaction, registerContinueAction } = useTxContext();
  const { provider: ethereum } = useSDK();

  useEffect(() => {
    registerContinueAction(() => {
      Alert.alert('ok', 'continue with success')
    })
  }, []);

  async function handleAddSupporter(data: AddSupporterProps) {
    if (!ethereum) {
      Alert.alert('Error', 'provider is undefined');
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
