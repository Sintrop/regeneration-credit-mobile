/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Modal, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Web3 from "web3";
import Clipboard from "@react-native-clipboard/clipboard";
import { ethers } from "ethers";

import { Icon, Text } from "@components";
import { useSettingsContext, useWalletContext } from "@hooks";
import { createRpcCall, getSendStart, isUserRejection, sendTransactionOnSintrop, waitForSentTransaction } from "@services";

/** Data that every confirmed transaction may change. */
import Toast from "react-native-toast-message";

export interface SendTransactionProps {
  contractAddress?: string;
  contractAbi?: any;
  params?: any;
  methodName?: string;
  interactWithContract?: boolean;
  value?: string | number; // Alterado para aceitar string de Wei
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

interface TraceTxProps {
  gas: string;
  failed: string;
  returnValue: string;
  structLogs: []
}

export interface SendTransactionOptions {
  /** Shown as step 1 when a follow-up is given. */
  label?: string;
  /** Second transaction, sent right after this one is confirmed, in the same flow. */
  followUp?: { tx: SendTransactionProps; label: string };
}

interface TxStep {
  current: number;
  total: number;
  label?: string;
}

interface TxProviderProps {
  children: ReactNode;
}
export interface TxContextProps {
  hash: string;
  sendTransaction: (txData: SendTransactionProps, options?: SendTransactionOptions) => Promise<void>;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  registerContinueAction: (action: () => void) => void;
}
export const TxContext = createContext({} as TxContextProps);

export function TxProvider({ children }: TxProviderProps) {
  const { rpc } = useSettingsContext();
  const { t } = useTranslation();
  const { wallet, linkMode } = useWalletContext();
  const queryClient = useQueryClient();
  const [hash, setHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModalTx, setShowModalTx] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingSent, setCheckingSent] = useState(false);
  const stopCheckingRef = useRef(false);
  const [step, setStep] = useState<TxStep | null>(null);
  const [firstStepDone, setFirstStepDone] = useState(false);
  const followUpRef = useRef<SendTransactionOptions['followUp']>(undefined);
  const [onContinueSuccessAction, setOnContinueSuccessAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (hash !== '' && showModalTx) {
      watchTransaction(hash)
    }
  }, [hash, showModalTx])

  async function sendTransaction(txData: SendTransactionProps, options?: SendTransactionOptions) {
    followUpRef.current = options?.followUp;
    setFirstStepDone(false);
    setStep(options?.followUp ? { current: 1, total: 2, label: options.label } : null);
    await startTransaction(txData);
  }

  async function startTransaction(txData: SendTransactionProps) {
    const from = wallet?.getAccount();
    if (!wallet || !from) {
      Alert.alert(t('market.error'), t('common.walletUnavailable'));
      return;
    }

    setHash('');
    setIsLoading(true);
    setShowModalTx(true);
    setIsError(false);
    setIsSuccess(false);
    setErrorMessage('');

    try {
      let txParams: Record<string, string>;

      if (txData.interactWithContract) {
        const web3 = new Web3();
        const contract = new web3.eth.Contract(txData?.contractAbi, txData?.contractAddress);

        txParams = {
          from,
          to: txData.contractAddress as string,
          data: contract.methods[txData?.methodName ?? ''](...txData.params).encodeABI(),
        };
      } else {
        const valueInWei = txData.params?.[0]?.value;

        txParams = {
          from,
          to: txData.params?.[0]?.to,
          value: '0x' + BigInt(valueInWei).toString(16),
        };
      }

      const rpcCall = createRpcCall(rpc);
      const start = await getSendStart(rpcCall, from).catch(() => undefined);

      try {
        setHash(await sendTransactionOnSintrop(wallet, txParams));
      } catch (error) {
        if (isUserRejection(error)) {
          setErrorMessage(t('tx.rejected'));
          throw error;
        }
        if ((error as Error)?.message?.includes('Sintrop network')) {
          setErrorMessage(t('tx.wrongChain'));
          throw error;
        }

        // The wallet may have sent it and the answer got lost while the app was
        // in the background: look for it on-chain before reporting a failure.
        const sentHash = start
          ? await checkIfSent(() => waitForSentTransaction(rpcCall, from, start, {
            isCancelled: () => stopCheckingRef.current,
          }))
          : undefined;
        if (sentHash) {
          setHash(sentHash);
          return;
        }
        setErrorMessage(t('tx.notConfirmed'));
        throw error;
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setIsError(true);
      setIsSuccess(false);
    }
  }

  async function checkIfSent(wait: () => Promise<string | undefined>) {
    stopCheckingRef.current = false;
    setCheckingSent(true);
    try {
      return await wait();
    } finally {
      setCheckingSent(false);
    }
  }

  function stopChecking() {
    stopCheckingRef.current = true;
  }

  async function watchTransaction(txHash: string) {
    const response = await getReceiptTx(txHash);
    if (response.hasReceipt) {
      if (response.successTx) {
        // Balances, timers and every on-screen read may have changed with this transaction.
        queryClient.invalidateQueries();
        const followUp = followUpRef.current;
        if (followUp) {
          followUpRef.current = undefined;
          setFirstStepDone(true);
          setStep({ current: 2, total: 2, label: followUp.label });
          startTransaction(followUp.tx);
          return;
        }
        setIsSuccess(true);
        setIsError(false);
        setIsLoading(false);
      } else {
        setIsSuccess(false);
        setIsError(true);
        setIsLoading(false);
        getError(txHash);
      }
    } else {
      setTimeout(() => watchTransaction(txHash), 2000);
    }
  }

  async function getReceiptTx(txHash: string): Promise<{ hasReceipt: boolean; successTx: boolean}> {
    try {
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
      const data = await response.json() as {jsonRpc: string; id: number; result: ReceiptTxProps | null};
      if (!data.result) {
        return { hasReceipt: false, successTx: false };
      }
      return {
        hasReceipt: true,
        successTx: data.result.status === '0x1'
      }
    } catch (e) {
      return {
        hasReceipt: false,
        successTx: false,
      }
    }
  }

  async function getError(txHash: string) {
    try {
      setIsLoadingError(true);
      const response = await fetch(rpc, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "debug_traceTransaction",
          params: [txHash],
          id: 0,
        })
      })
      const data = await response.json() as {jsonRpc: string; id: number; result: TraceTxProps};
      const iface = new ethers.Interface(["error Error(string)"]);
      const decodedValue = iface.parseError("0x" + data?.result?.returnValue);

      if (decodedValue) {
        if (decodedValue.args && decodedValue.args.length > 0){
          setErrorMessage(decodedValue?.args[0]);
        }
      }
    } catch (e) {
      console.log(e);
      setErrorMessage(t('tx.errorOnGetErrorMessage'))
    } finally {
      setIsLoadingError(false);
    }
  }

  function handleContinue() {
    // When only the follow-up failed, the main transaction went through: finish its flow too.
    if (onContinueSuccessAction && (isSuccess || firstStepDone)) {
      onContinueSuccessAction();
    }
    followUpRef.current = undefined;
    setStep(null);
    setFirstStepDone(false);
    setOnContinueSuccessAction(null);
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
              <Text className="text-white">{t('tx.title')}</Text>
              <View className=""/>
            </View>
            {step && (
              <Text className="text-gray-300 text-xs text-center mt-1">
                {t('tx.step', { current: step.current, total: step.total })}{step.label ? ` · ${step.label}` : ''}
              </Text>
            )}

            {isLoading ? (
              <View className="h-[150] items-center justify-center w-full">
                {checkingSent ? (
                  <View className="gap-4 items-center px-2">
                    <View className="flex-row gap-3 items-center">
                      <ActivityIndicator size={30} color="white"/>
                      <Text className="text-white font-semibold text-center flex-shrink">
                        {t('tx.checkingSent')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="h-10 px-6 rounded-2xl items-center justify-center border border-white/40"
                      onPress={stopChecking}
                    >
                      <Text className="text-white">{t('tx.stopChecking')}</Text>
                    </TouchableOpacity>
                  </View>
                ) : hash === '' ? (
                  <View className="gap-2 items-center px-2">
                    <Text className="text-white font-semibold text-center">
                      {t('tx.confirmInYourWallet')}
                    </Text>
                    {linkMode === 'remote' && (
                      <Text className="text-gray-300 text-sm text-center">
                        {t('tx.approveOnOtherDevice')}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="gap-5 items-center">
                    <View className="flex-row gap-5 items-center">
                      <ActivityIndicator size={50} color="white"/>
                      <Text className="text-white font-semibold">
                        {t('tx.processingTransaction')}
                      </Text>
                    </View>

                    <AreaHash hash={hash} />
                  </View>
                )}
              </View>
            ) : (
              <View className="h-[250] items-center justify-center w-full">
                <View className="gap-5 w-full">
                  {isSuccess && (
                    <Text className="text-green-500 font-semibold text-center">
                      {t('tx.txSuccess')}
                    </Text>
                  )}
                  {isError && (
                    <View className="w-full items-center gap-5">
                      <Text className="text-red-500 font-semibold text-center">
                        {t('tx.txFailed')}
                      </Text>
                      {firstStepDone && (
                        <Text className="text-gray-200 text-sm text-center">
                          {t('tx.firstStepDone')}
                        </Text>
                      )}

                      <View className="gap-1 w-full">
                        <Text className="text-gray-300 text-sm">
                          {t('tx.errorDetails')}
                        </Text>

                        {isLoadingError ? (
                          <ActivityIndicator size={40} color="white" />
                        ) : (
                          <Text className="text-red-500" numberOfLines={2}>{errorMessage}</Text>
                        )}
                      </View>
                    </View>
                  )}
                  <AreaHash hash={hash} />
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

interface AreaHashProps {
  hash: string;
}
function AreaHash({hash}: AreaHashProps) {
  const { t } = useTranslation();
  const { explorerUrl } = useSettingsContext();

  async function handleCopyHash() {
    Clipboard.setString(hash);
    Toast.show({
      type: 'success',
      text1: t('tx.hashCopiedToTransferArea')
    })
  }

  function handleOpenOnExplorer() {
    Linking.openURL(`${explorerUrl}/tx/${hash}`)
  }

  return (
    <View className="gap-1 w-full">
      <Text className="text-gray-300 text-sm">
        {t('tx.transactionHash')}
      </Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-white max-w-[90%]" numberOfLines={1}>{hash}</Text>
        <TouchableOpacity
          hitSlop={5}
          onPress={handleCopyHash}
        >
          <Icon name="copy" size={30} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center gap-3"
        onPress={handleOpenOnExplorer}
      >
        <Text className="text-white underline">
          {t('tx.viewOnExplorer')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}