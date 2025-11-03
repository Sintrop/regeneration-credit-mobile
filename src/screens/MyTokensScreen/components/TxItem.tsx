import { useRef } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

import { Icon, Text } from "@components";
import { TxProps } from "@domain";
import { useAppSafeArea, useSettingsContext, useUserContext } from "@hooks";

interface Props {
  tx: TxProps;
}
export function TxItem({ tx }: Props) {
  const { explorerUrl } = useSettingsContext();
  const { t } = useTranslation();
  const { address } = useUserContext();
  const { bottom } = useAppSafeArea();
  const modalRef = useRef<Modalize>(null);

  function handleViewOnExplorer() {
    Linking.openURL(`${explorerUrl}/tx/${tx.hash}`);
  }

  return (
    <>
      <TouchableOpacity 
        className="p-3 rounded-2xl bg-card-primary w-full flex-row justify-between mb-1"
        onPress={() => modalRef.current?.open()}
      >
        <View className="flex-row gap-2">
          <View className="bg-white w-12 h-12 rounded-full items-center justify-center">
            <Icon
              name={tx.coin === 'RC' ? 'rc' : 'sin'}
              size={25}
            />
          </View>
          <View className="w-[150]">
            <Text className="text-gray-300 text-sm">
              {tx.type === 'RECEIVE' ? t('myTokens.from') : t('myTokens.to')}
            </Text>
            <Text className="text-white max-w-[90%]" numberOfLines={1} >
              {tx.type === 'RECEIVE' ? tx.from : tx.to}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className="font-semibold text-white">
            {Intl.NumberFormat('pt-BR').format(tx.value / 10 ** 18)}
          </Text>
          <Icon 
            name={tx.type === 'RECEIVE' ? 'arrowUp' : 'arrowDown'}
            color={tx.type === 'RECEIVE' ? 'green' : 'red'}
          />
        </View>
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="rounded-t-2xl p-5 bg-card-primary"
            style={{ paddingBottom: bottom + 20 }}
          >
            <Text className="font-semibold text-white text-center">{t('myTokens.txDetails')}</Text>

            <View className="mt-7 gap-3">
              <ItemValue
                label={t('myTokens.txHash')}
                value={tx.hash}
                showCopyValue
              />

              <ItemValue
                label={t('myTokens.from')}
                value={tx.from}
                isYou={address.toUpperCase() === tx.from.toUpperCase()}
                showCopyValue
              />

              <ItemValue
                label={t('myTokens.to')}
                value={tx.to}
                isYou={address.toUpperCase() === tx.to.toUpperCase()}
                showCopyValue
              />

              <ItemValue
                label={t('common.block')}
                value={tx.blockNumber}
              />

              <ItemValue
                label={t('common.value')}
                value={Intl.NumberFormat('pt-BR').format(tx.value / 10 ** 18)}
                suffix={tx.coin.toUpperCase()}
              />
            </View>

            <TouchableOpacity
              className="mt-5 items-center justify-center"
              onPress={handleViewOnExplorer}
            >
              <Text className="text-white underline">{t('tx.viewOnExplorer')}</Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
    </>
  )
}

interface ItemValueProps {
  label: string;
  value: string | number;
  isYou?: boolean;
  showCopyValue?: boolean;
  suffix?: string | number;
}
function ItemValue({ value, label, isYou, showCopyValue, suffix }: ItemValueProps) {
  const { t } = useTranslation();

  function handleCopyValue() {
    if (typeof value === 'number') {
      Clipboard.setString(value.toString());
    } else {
      Clipboard.setString(value);
    }
    Toast.show({
      type: 'success',
      text1: t('common.copiedToClipboard')
    })
  }
  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="w-full max-w-[90%]">
        <View className="flex-row items-center gap-3 w-full">
          <Text className="text-sm text-gray-300">{label}</Text>
          {isYou && (
            <View className="px-2 h-6 bg-green-primary items-center justify-center rounded-full">
              <Text className="text-white text-xs">{t('common.you')}</Text>
            </View>
          )}
        </View>
        <Text className="text-white max-w-[90%]" numberOfLines={1}>{value} {suffix && suffix}</Text>
      </View>

      {showCopyValue && (
        <TouchableOpacity
          onPress={handleCopyValue}
          className="mt-2"
        >
          <Icon name="copy" color="white" size={25} />
        </TouchableOpacity>
      )}
    </View>
  )
}
