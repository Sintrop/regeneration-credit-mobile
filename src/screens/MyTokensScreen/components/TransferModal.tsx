import { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, TextInput as RNTextInput, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { utils } from "web3";

import { Text as TextComponent, Icon } from "@components";
import { useTxContext, useUserContext } from "@hooks";
import { RegenerationCredit } from "@contracts";
import { useBalance } from "@domain";

//@ts-ignore
import RCIcon from "../../../../assets/images/rc.png";
//@ts-ignore
import SINIcon from "../../../../assets/images/sin.png";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export type TokenType = 'RC' | 'SIN';

export function TransferModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { address, balanceSIN, isConnected } = useUserContext();
  const { balance: balanceRC, refetch: refetchBalance } = useBalance({ address });
  const { registerContinueAction, sendTransaction } = useTxContext();

  const [selectedToken, setSelectedToken] = useState<TokenType>('RC');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(true);

  useEffect(() => {
    registerContinueAction(() => {
      onClose();
      refetchBalance();
      setToAddress('');
      setAmount('');
    });
  }, []);

  function validateAddress(address: string): boolean {
    return utils.isAddress(address);
  }

  function handleAddressChange(text: string) {
    setToAddress(text);
    if (text.length > 0) {
      setIsAddressValid(validateAddress(text));
    } else {
      setIsAddressValid(true);
    }
  }

  function handleTokenSelect(token: TokenType) {
    setSelectedToken(token);
    if (token === 'RC') {
      setAmount(balanceRC ? balanceRC.toString() : '');
    } else {
      setAmount(balanceSIN ? balanceSIN.toString() : '');
    }
  }

  function handleMax() {
    if (selectedToken === 'RC') {
      setAmount(balanceRC ? balanceRC.toString() : '');
    } else {
      setAmount(balanceSIN ? balanceSIN.toString() : '');
    }
  }

  function handleTransfer() {
    if (!isAddressValid || !amount || parseFloat(amount) <= 0) return;

    if (selectedToken === 'SIN') {
      handleTransferSIN();
    } else {
      handleTransferRC();
    }
  }

  function handleTransferSIN() {
    const valueInWei = utils.toWei(amount, 'ether');
    sendTransaction({
      interactWithContract: false,
      params: [{
        to: toAddress,
        value: valueInWei,
      }]
    } as any);
  }

  function handleTransferRC() {
    const valueInWei = utils.toWei(amount, 'ether');
    sendTransaction({
      interactWithContract: true,
      contractAbi: RegenerationCredit.abi,
      contractAddress: RegenerationCredit.address,
      methodName: 'transfer',
      params: [toAddress, valueInWei]
    });
  }

  const canTransfer = 
    isAddressValid && 
    toAddress.trim().length > 0 && 
    amount && 
    parseFloat(amount) > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 w-full h-full items-center justify-center bg-black/80">
        <View className="bg-card-primary w-[95%] rounded-2xl p-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <TextComponent className="text-white text-lg font-bold">{t('myTokens.transfer')}</TextComponent>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Icon name="chevronLeft" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Token Selector */}
          <View className="flex-row gap-3 mb-5">
            <TouchableOpacity
              className={`flex-1 h-12 rounded-xl items-center justify-center flex-row gap-2 ${selectedToken === 'RC' ? 'bg-green-600' : 'bg-gray-700'}`}
              onPress={() => handleTokenSelect('RC')}
            >
              <TextComponent className="text-white font-semibold">RC</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 h-12 rounded-xl items-center justify-center flex-row gap-2 ${selectedToken === 'SIN' ? 'bg-green-600' : 'bg-gray-700'}`}
              onPress={() => handleTokenSelect('SIN')}
            >
              <TextComponent className="text-white font-semibold">SIN</TextComponent>
            </TouchableOpacity>
          </View>

          {/* Balance */}
          <View className="mb-5">
            <TextComponent className="text-gray-400 text-sm">{t('common.yourBalance')}</TextComponent>
            <TextComponent className="text-white text-xl font-semibold mt-1">
              {selectedToken === 'RC' 
                ? `${balanceRC?.toFixed(5) || '0'} RC`
                : `${balanceSIN?.toFixed(5) || '0'} SIN`
              }
            </TextComponent>
          </View>

          {/* To Address */}
          <View className="mb-4">
            <TextComponent className="text-gray-300 text-sm mb-2">{t('myTokens.recipientAddress')}</TextComponent>
            <RNTextInput
              className="w-full rounded-2xl bg-card-secondary text-white px-3 h-12"
              placeholderTextColor="#aaa"
              placeholder="0x..."
              value={toAddress}
              onChangeText={handleAddressChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!isAddressValid && (
              <TextComponent className="text-red-400 text-xs mt-1">{t('myTokens.invalidAddress')}</TextComponent>
            )}
          </View>

          {/* Amount */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <TextComponent className="text-gray-300 text-sm">{t('myTokens.amount')}</TextComponent>
              <TouchableOpacity onPress={handleMax}>
                <TextComponent className="text-blue-400 text-sm">{t('myTokens.max')}</TextComponent>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-2">
              <RNTextInput
                className="flex-1 rounded-2xl bg-card-secondary text-white px-3 h-12"
                placeholderTextColor="#aaa"
                placeholder="0.0"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <TextComponent className="text-white text-lg font-semibold w-16 text-center">
                {selectedToken}
              </TextComponent>
            </View>
          </View>

          {/* Transfer Button */}
          <TouchableOpacity
            className={`h-12 rounded-xl items-center justify-center ${canTransfer ? 'bg-green-600' : 'bg-gray-600'}`}
            disabled={!canTransfer}
            onPress={handleTransfer}
          >
            <TextComponent className="text-white font-bold text-base">
              {t('myTokens.transfer')}
            </TextComponent>
          </TouchableOpacity>

          {/* Info */}
          <TextComponent className="text-gray-500 text-xs text-center mt-4">
            {t('myTokens.transferInfo')}
          </TextComponent>
        </View>
      </View>
    </Modal>
  );
}
