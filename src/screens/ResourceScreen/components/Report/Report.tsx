import { TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { DataItem, Icon, Text } from "@components";
import { useGetReport } from "@domain";
import { AppStackParamsList } from "@routes";
import { useSettingsContext } from "@hooks";

import { Developer } from "./Developer";

interface Props {
  id: number
}
type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "ResourceScreen">
export function Report({ id }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { ipfsGateway } = useSettingsContext();
  const { report } = useGetReport({ reportId: id });

  function handleGoToPdfView() {
    navigation.navigate("PdfViewScreen", {
      uri: `${ipfsGateway}/ipfs/${report?.report}`
    });
  }

  return (
    <View className="p-3 gap-3">
      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("resourceScreen.reportData")}
        </Text>

        <DataItem title="ID" value={id} />
        <DataItem title={t("resourceScreen.createdAt")} value={report?.createdAtBlockNumber} />
        <DataItem title="Era" value={report?.era} />
        <DataItem title={t("resourceScreen.invalidatedAt")} value={report?.invalidatedAt} />
        <DataItem title={t("resourceScreen.validationsCount")} value={report?.validationsCount} />
        <DataItem title="Valid" value={report?.valid.toString()} />
      </View>

      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("common.description")}
        </Text>

        <Text className="text-white">{report?.description}</Text>
      </View>

      <Developer address={report?.developer ? report.developer : ""} />

      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("resourceScreen.file")}
        </Text>

        <TouchableOpacity
          className="w-28 p-3 rounded-2xl items-center gap-2"
          onPress={handleGoToPdfView}
        >
          <Icon name="file" size={80} />
          <Text className="text-sm text-white text-center">
            {t("resourceScreen.seeReport")}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-300 text-sm">
          Hash
        </Text>
        <Text className="text-white text-sm">{report?.report}</Text>
      </View>
    </View>
  )
}
