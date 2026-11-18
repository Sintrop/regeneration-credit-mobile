import i18next from "i18next";
import React from "react";
import Toast from "react-native-toast-message";

import { RCMarket } from "@contracts";
import { useTxContext, useWalletContext } from "@hooks";

interface CancelOfferProps {
  offerId: number;
}

interface ReturnUseCancelOffer {
  isLoading: boolean;
  cancelOffer: (data: CancelOfferProps) => void;
}

export function useCancelOffer(): ReturnUseCancelOffer {
  const { sendTransaction } = useTxContext();
  const { wallet } = useWalletContext();
  const [isLoading, setIsLoading] = React.useState(false);

  async function cancelOffer(data: CancelOfferProps) {
    if (!wallet) {
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
        methodName: 'cancelOffer',
        params: [data.offerId]
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: i18next.t('market.errorCancelingOffer'),
        text2: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, cancelOffer };
}