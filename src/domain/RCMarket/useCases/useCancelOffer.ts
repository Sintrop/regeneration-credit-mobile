import React from "react";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { RCMarket } from "@contracts";
import { useTxContext } from "@hooks";

interface CancelOfferProps {
  offerId: number;
}

interface ReturnUseCancelOffer {
  isLoading: boolean;
  cancelOffer: (data: CancelOfferProps) => void;
}

export function useCancelOffer(): ReturnUseCancelOffer {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();
  const [isLoading, setIsLoading] = React.useState(false);

  async function cancelOffer(data: CancelOfferProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
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
        text1: 'Error canceling offer',
        text2: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, cancelOffer };
}