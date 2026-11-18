import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";

import { Text } from "@components";
import colors from "../../theme/colors";

interface Props {
  visible: boolean;
  /** One-time pairing link from MetaMask Connect; undefined while it is being created. */
  uri?: string;
  onCancel: () => void;
}

/** QR code to connect MetaMask installed on another phone. */
export function WalletQrModal({ visible, uri, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 w-full h-full items-center justify-center bg-black/60">
        <View className="bg-card-primary w-[90%] p-5 rounded-2xl items-center gap-4">
          <Text className="text-white font-bold text-lg text-center">{t("wallet.qrTitle")}</Text>
          <Text className="text-gray-300 text-sm text-center">{t("wallet.qrInstructions")}</Text>

          <View className="w-[260] h-[260] items-center justify-center rounded-2xl bg-white">
            {uri ? (
              <QRCode value={uri} size={236} ecl="L" />
            ) : (
              <ActivityIndicator size={40} color={colors.background} />
            )}
          </View>

          <Text className="text-gray-400 text-xs text-center">{t("wallet.qrApprovalNote")}</Text>

          <TouchableOpacity
            className="w-full h-12 rounded-2xl items-center justify-center border border-white/40"
            onPress={onCancel}
          >
            <Text className="text-white font-semibold">{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
