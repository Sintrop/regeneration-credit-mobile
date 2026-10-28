import { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, TextInput as RNTextInput, Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { utils } from "web3";

import { Text as TextComponent, Icon } from "@components";
import { useTxContext, useUserContext } from "@hooks";
import { RegenerationCredit } from "@contracts";
import { useBalance } from "@domain";
import { amountToWei, balanceToInput, parseAmountInput } from "@utils";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export type TokenType = 'RC' | 'SIN';

export function TransferModal({ visible, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { address, balanceSIN } = useUserContext();
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
    setAmount('0');
  }

  function handleMax() {
    if (selectedToken === 'RC') {
      setAmount(balanceToInput(balanceRC));
    } else {
      setAmount(balanceToInput(balanceSIN));
    }
  }

  const valueInWei = amountToWei(amount);
  const selectedBalance = selectedToken === 'RC' ? balanceRC : balanceSIN;
  const insufficientBalance = parseAmountInput(amount) > (selectedBalance ?? 0);

  function handleTransfer() {
    if (!canTransfer || !valueInWei) return;

    onClose();

    if (selectedToken === 'SIN') {
      handleTransferSIN();
    } else {
      handleTransferRC();
    }
  }

  function handleTransferSIN() {
    sendTransaction({
      interactWithContract: false,
      params: [{
        to: toAddress,
        value: valueInWei,
      }]
    } as any);
  }

  function handleTransferRC() {
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
    valueInWei !== null &&
    BigInt(valueInWei) > 0n &&
    !insufficientBalance;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 w-full h-full items-center justify-center bg-black/80">
        <View className="bg-card-primary w-[95%] rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-5">
            <TextComponent className="text-white text-lg font-bold">{t('myTokens.transfer')}</TextComponent>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Icon name="chevronLeft" size={24} color="white" />
            </TouchableOpacity>
          </View>

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

          <View className="mb-5">
            <TextComponent className="text-gray-400 text-sm">{t('common.yourBalance')}</TextComponent>
            <TextComponent className="text-white text-xl font-semibold mt-1">
              {selectedToken === 'RC' 
                ? `${Intl.NumberFormat(i18n.language, { maximumFractionDigits: 5 }).format(balanceRC ?? 0)} RC`
                : `${Intl.NumberFormat(i18n.language, { maximumFractionDigits: 5 }).format(balanceSIN ?? 0)} SIN`
              }
            </TextComponent>
          </View>

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
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {!isAddressValid && (
              <TextComponent className="text-red-400 text-xs mt-1">{t('myTokens.invalidAddress')}</TextComponent>
            )}
          </View>

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
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TextComponent className="text-white text-lg font-semibold w-16 text-center">
                {selectedToken}
              </TextComponent>
            </View>
            {insufficientBalance && (
              <TextComponent className="text-red-400 text-xs mt-1">{t('common.insufficientBalance')}</TextComponent>
            )}
          </View>

          <TouchableOpacity
            className={`h-12 rounded-xl items-center justify-center ${canTransfer ? 'bg-green-600' : 'bg-gray-600'}`}
            disabled={!canTransfer}
            onPress={handleTransfer}
          >
            <TextComponent className="text-white font-bold text-base">
              {t('myTokens.transfer')}
            </TextComponent>
          </TouchableOpacity>

          <TextComponent className="text-gray-500 text-xs text-center mt-4">
            {t('myTokens.transferInfo')}
          </TextComponent>
        </View>
      </View>
    </Modal>
  );
}