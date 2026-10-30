import i18next from "i18next";
import React from "react";
import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { RCMarket } from "@contracts";
import { useTxContext } from "@hooks";

interface ConfirmSaleProps {
  offerId: number;
  buyer: string;
}

interface ReturnUseConfirmSale {
  isLoading: boolean;
  confirmSale: (data: ConfirmSaleProps) => void;
}

export function useConfirmSale(): ReturnUseConfirmSale {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();
  const [isLoading, setIsLoading] = React.useState(false);

  async function confirmSale(data: ConfirmSaleProps) {
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
        methodName: 'confirmSale',
        params: [data.offerId, data.buyer]
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: i18next.t('market.errorConfirmingSale'),
        text2: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, confirmSale };
}