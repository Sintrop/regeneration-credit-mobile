import { useRef, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

import { Icon, Text } from "@components";
import { useBalance, useCertificatedTokens, useNativeBalance } from "@domain";
import { useAppSafeArea, useUserContext } from "@hooks";

//@ts-ignore
import RCIcon from "../../../assets/images/rc.png";
//@ts-ignore
import SINIcon from "../../../assets/images/sin.png";

interface BalanceProps {
  onTransfer?: () => void;
}

export function Balance({ onTransfer }: BalanceProps) {
  const { address } = useUserContext();
  const { balance: balanceSIN, isLoading: isLoadingSin } = useNativeBalance(address);
  const { t, i18n } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { balance, isLoading: isLoadingRc } = useBalance({ address });
  const { certificated } = useCertificatedTokens({ address });
  const receiveModal = useRef<Modalize>(null);
  const [showBalance, setShowBalance] = useState(true);

  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);
  const hidden = "••••••";

  function handleCopy() {
    Clipboard.setString(address);
    Toast.show({ type: "success", text1: t("common.addressCopied") });
  }

  return (
    <View className="w-full p-5 rounded-2xl bg-card-primary gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-300 text-sm">{t("common.yourBalance")}</Text>
        <TouchableOpacity onPress={() => setShowBalance(value => !value)} hitSlop={10}>
          <Icon name={showBalance ? "hide" : "show"} size={22} />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-3">
        <Image source={RCIcon} className="w-11 h-11" resizeMode="contain" />
        {isLoadingRc ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-3xl font-bold">{showBalance ? format(balance) : hidden} <Text className="text-gray-300 text-lg">RC</Text></Text>
        )}
      </View>

      <View className="flex-row items-center gap-3">
        <Image source={SINIcon} className="w-8 h-8" resizeMode="contain" />
        {isLoadingSin ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg">{showBalance ? format(balanceSIN) : hidden} <Text className="text-gray-300 text-sm">SIN</Text></Text>
        )}
        <Text className="text-gray-500 text-xs">{t("myTokens.gasHint")}</Text>
      </View>

      {certificated > 0 && (
        <View className="flex-row items-center justify-between p-3 rounded-xl bg-green-primary/10">
          <Text className="text-gray-300 text-sm">{t("myTokens.certified")}</Text>
          <Text className="text-green-primary font-bold">{showBalance ? format(certificated) : hidden} RC</Text>
        </View>
      )}

      <TouchableOpacity className="flex-row items-center gap-2" onPress={handleCopy} hitSlop={5}>
        <Text className="text-gray-400 text-xs flex-1" numberOfLines={1}>{address}</Text>
        <Icon name="copy" size={18} />
      </TouchableOpacity>

      <View className="flex-row gap-3">
        {onTransfer && (
          <TouchableOpacity className="flex-1 h-12 rounded-2xl items-center justify-center bg-green-primary" onPress={onTransfer}>
            <Text className="text-green-secondary font-bold">{t("myTokens.transfer")}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="flex-1 h-12 rounded-2xl items-center justify-center border border-green-primary" onPress={() => receiveModal.current?.open()}>
          <Text className="text-green-primary font-bold">{t("myTokens.receive")}</Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Modalize ref={receiveModal} adjustToContentHeight modalStyle={{ backgroundColor: "transparent" }}>
          <View className="rounded-t-2xl p-5 bg-card-primary items-center gap-4" style={{ paddingBottom: bottom + 20 }}>
            <Text className="text-white font-semibold">{t("myTokens.receive")}</Text>
            <Text className="text-gray-300 text-sm text-center">{t("myTokens.receiveHint")}</Text>
            <View className="p-4 rounded-2xl bg-white">
              <QRCode value={address} size={200} />
            </View>
            <Text className="text-white text-xs text-center">{address}</Text>
            <TouchableOpacity className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary" onPress={handleCopy}>
              <Text className="text-green-secondary font-bold">{t("myTokens.copyAddress")}</Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
