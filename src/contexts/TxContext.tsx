/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSDK } from "@metamask/sdk-react";
import Web3 from "web3";

import { Text } from "@components";
import { useSettingsContext } from "@hooks";

interface SendTransactionProps {
  contractAddress?: string;
  contractAbi?: any;
  params?: any;
  methodName?: string;
  interactWithContract?: boolean;
  value?: number;
}

interface ReceiptTxProps {
  blockHash: string;
  blockNumber: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  logs: string;
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: string;
  type: string;
}

interface TxProviderProps {
  children: ReactNode;
}
export interface TxContextProps {
  hash: string;
  sendTransaction: (txData: SendTransactionProps) => Promise<void>;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  registerContinueAction: (action: () => void) => void;
}
export const TxContext = createContext({} as TxContextProps);

export function TxProvider({ children }: TxProviderProps) {
  const { rpc } = useSettingsContext();
  const { t } = useTranslation();
  const { provider: ethereum } = useSDK();
  const [hash, setHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModalTx, setShowModalTx] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [onContinueSuccessAction, setOnContinueSuccessAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (hash !== '' && showModalTx) {
      watchTransaction(hash)
    }
  }, [hash, showModalTx])

  async function sendTransaction(txData: SendTransactionProps) {
    if (!ethereum) {
      Alert.alert('Error', 'provider is undefined');
      return;
    }

    setHash('');
    setIsLoading(true);
    setShowModalTx(true);
    setIsError(false);
    setIsSuccess(false);

    if (txData.interactWithContract) {
      const web3 = new Web3(ethereum as any);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(txData?.contractAbi, txData?.contractAddress);
    
      try {
        const response = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: accounts[0],
            to: txData.contractAddress,
            data: contract.methods[txData?.methodName ?? ''](...txData.params).encodeABI(),
          }],
        });
        setHash(response as string);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setIsError(true);
        setIsSuccess(false);
      }
    }
  }

  async function watchTransaction(txHash: string) {
    const receipt = await getReceiptTx(txHash);
    if (receipt && receipt.result.status === '0x1') {
      setIsSuccess(true);
      setIsError(false);
      setIsLoading(false);
    } else if (receipt && receipt.result.status === '0x0') {
      setIsSuccess(false);
      setIsError(true);
      setIsLoading(false);
    } else {
      setTimeout(() => watchTransaction(txHash), 2000);
    }
  }

  async function getReceiptTx(txHash: string): Promise<{jsonRpc: string; id: number; result: ReceiptTxProps}> {
    const response = await fetch(rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [txHash],
        id: 0,
      })
    })
    const data = await response.json();
    return data
  }

  function handleContinue() {
    if (onContinueSuccessAction && isSuccess) {
      onContinueSuccessAction();
    }
    setShowModalTx(false);
    setIsError(false);
    setIsSuccess(false);
    setHash('');
  }

  function registerContinueAction(action: () => void){
    setOnContinueSuccessAction(() => action);
  }

  return (
    <TxContext.Provider
      value={{ 
        hash, 
        sendTransaction,
        isError,
        isSuccess,
        isLoading,
        registerContinueAction
      }}
    >
      {children}

      <Modal
        visible={showModalTx}
        animationType="fade"
        transparent
      >
        <View className="flex-1 w-full h-full items-center justify-center bg-black/60">
          <View className="bg-card-primary w-[90%] p-3 rounded-2xl">
            <View className="w-full flex-row items-center justify-between">
              <View className=""/>
              <Text className="text-white">transaction</Text>
              <View className=""/>
            </View>

            {isLoading ? (
              <View className="h-[150] items-center justify-center w-full">
                {hash === '' ? (
                  <Text className="text-white font-semibold">
                    {t('tx.confirmInYourWallet')}
                  </Text>
                ) : (
                  <View className="gap-5 items-center">
                    <View className="flex-row gap-5 items-center">
                      <ActivityIndicator size={50} color="white"/>
                      <Text className="text-white font-semibold">
                        {t('tx.processingTransaction')}
                      </Text>
                    </View>

                    <View className="gap-1 w-full">
                      <Text className="text-gray-300 text-sm">
                        {t('tx.transactionHash')}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <Text className="text-white" numberOfLines={1}>{hash}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="h-[200] items-center justify-center w-full">
                <View className="gap-5">
                  {isSuccess && (
                    <Text className="text-green-500 font-semibold text-center">
                      {t('tx.txSuccess')}
                    </Text>
                  )}
                  {isError && (
                    <Text className="text-red-500 font-semibold text-center">
                      {t('tx.txFailed')}
                    </Text>
                  )}
                  <View className="gap-1 w-full">
                    <Text className="text-gray-300 text-sm">
                      {t('tx.transactionHash')}
                    </Text>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-white" numberOfLines={1}>{hash}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  className="w-full h-12 rounded-2xl items-center justify-center bg-green-600 mt-5"
                  onPress={handleContinue}
                >
                  <Text className="font-semibold text-white">
                    {t('common.continue')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </TxContext.Provider>
  )
}
