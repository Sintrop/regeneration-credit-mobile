import i18next from "i18next";
import React from "react";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { RCMarket } from "@contracts";
import { useTxContext } from "@hooks";

interface CreateOfferProps {
  amountRC: string;
  unitPrice: string;
  paymentMethod: string;
  description: string;
}

interface ReturnUseCreateOffer {
  isLoading: boolean;
  createOffer: (data: CreateOfferProps) => void;
}

export function useCreateOffer(): ReturnUseCreateOffer {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();
  const [isLoading, setIsLoading] = React.useState(false);

  async function createOffer(data: CreateOfferProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: i18next.t('common.walletUnavailable')
      });
      return;
    }

    setIsLoading(true);

    try {
      sendTransaction({
        interactWithContract: true,
        contractAbi: RCMarket.abi,
        contractAddress: RCMarket.address,
        methodName: 'createOffer',
        params: [data.amountRC, data.unitPrice, data.paymentMethod, data.description]
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: i18next.t('market.errorCreatingOffer'),
        text2: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, createOffer };
}