import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { AppStackParamsList } from "@routes";
import { useSettingsContext } from "@hooks";

interface Props {
  proofPhotos: string;
  justificationReport: string
}
type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "ResourceScreen">
export function Reports({ justificationReport, proofPhotos }: Props) {
  const { ipfsGateway } = useSettingsContext();
  const navigation = useNavigation<NavigationProps>();
  const { t } = useTranslation();

  function handleGoToPdfView(hash: string) {
    navigation.navigate("PdfViewScreen", {
      uri: `${ipfsGateway}/ipfs/${hash}`
    });
  }

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("resourceScreen.reports")}
      </Text>

      <View className="mt-5 flex-row w-full items-center justify-center gap-10">
        <ButtonReport
          title={t("resourceScreen.justificationReport")}
          onPress={() => handleGoToPdfView(justificationReport)}
        />

        <ButtonReport
          title={t("resourceScreen.proofPhotosReport")}
          onPress={() => handleGoToPdfView(proofPhotos)}
        />
      </View>

      <View className="mt-5 gap-5">
        <View className="gap-1">
          <Text className="text-gray-300 text-sm">Hashes</Text>
          <Text className="text-gray-300 text-sm">{t("resourceScreen.justificationReport")}:</Text>
          <Text className="text-white text-sm">{justificationReport}</Text>
        </View>

        <View className="gap-1">
          <Text className="text-gray-300 text-sm">{t("resourceScreen.proofPhotosReport")}:</Text>
          <Text className="text-white text-sm">{proofPhotos}</Text>
        </View>
      </View>
    </View>
  )
}

interface ButtonReportProps extends TouchableOpacityProps {
  title: string;
}
function ButtonReport({ title, ...buttonProps }: ButtonReportProps) {
  return (
    <TouchableOpacity
      className="w-28 p-3 rounded-2xl items-center gap-2"
      {...buttonProps}
    >
      <View className="w-20 h-20 bg-white"/>
      <Text className="text-sm text-white text-center">{title}</Text>
    </TouchableOpacity>
  )
}
