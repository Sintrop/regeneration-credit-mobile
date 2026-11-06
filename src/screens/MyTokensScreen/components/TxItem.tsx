import { useRef } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

import { Icon, Text } from "@components";
import { TxProps, useBlockNumber, useGetUser, useUserBasicData } from "@domain";
import { useAppSafeArea, useBlocksDuration, useSettingsContext, useUserContext } from "@hooks";

import { POOL_NAME_KEY } from "../../PoolsScreen/poolLabels";

function CounterpartyName({ address, prefix }: { address: string; prefix: string }) {
  const { userType } = useGetUser({ address });
  const { user } = useUserBasicData({ address, userType });
  const name = user?.name?.trim() || `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <Text className="text-white font-semibold" numberOfLines={1}>{prefix} {name}</Text>
  );
}

interface Props {
  tx: TxProps;
}
export function TxItem({ tx }: Props) {
  const { explorerUrl } = useSettingsContext();
  const { t, i18n } = useTranslation();
  const { address } = useUserContext();
  const { blockNumber } = useBlockNumber();
  const formatBlocks = useBlocksDuration();
  const { bottom } = useAppSafeArea();
  const modalRef = useRef<Modalize>(null);

  function handleViewOnExplorer() {
    Linking.openURL(`${explorerUrl}/tx/${tx.hash}`);
  }

  const kind = tx.kind ?? (tx.type === "RECEIVE" ? "receive" : "send");
  const incoming = kind === "receive" || kind === "poolWithdraw";
  const counterparty = incoming ? tx.from : tx.to;
  const when = blockNumber > tx.blockNumber ? t("supporterProfile.ago", { duration: formatBlocks(blockNumber - tx.blockNumber).split(" (")[0] }) : "";

  return (
    <>
      <TouchableOpacity
        className="p-4 rounded-2xl bg-card-primary w-full flex-row items-center gap-3 mb-2"
        onPress={() => modalRef.current?.open()}
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center ${incoming ? "bg-green-primary/15" : kind === "burn" ? "bg-amber-400/15" : "bg-red-400/15"}`}>
          <Icon name={incoming ? "arrowDown" : "arrowUp"} color={incoming ? "#75d63a" : kind === "burn" ? "#fbbf24" : "#f87171"} size={18} />
        </View>
        <View className="flex-1">
          {kind === "burn" ? (
            <Text className="text-white font-semibold">{t("myTokens.kind.burn")}</Text>
          ) : kind === "poolWithdraw" ? (
            <Text className="text-white font-semibold">{t("myTokens.kind.poolWithdraw", { pool: t(POOL_NAME_KEY[tx.poolType ?? 1]) })}</Text>
          ) : (
            <CounterpartyName address={counterparty} prefix={incoming ? t("myTokens.from") : t("myTokens.to")} />
          )}
          <Text className="text-gray-400 text-xs">{when}</Text>
        </View>
        <Text className={`font-bold ${incoming ? "text-green-primary" : "text-white"}`}>
          {incoming ? "+" : "-"}{Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(tx.value / 10 ** 18)} RC
        </Text>
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
                value={Intl.NumberFormat(i18n.language, { maximumFractionDigits: 6 }).format(tx.value / 10 ** 18)}
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
