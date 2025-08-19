import { TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { DataItem, Icon, Text } from "@components";
import { useGetResearch } from "@domain";
import { AppStackParamsList } from "@routes";
import { useSettingsContext } from "@hooks";
import { Researcher } from "./Researcher";

interface Props {
  id: number
}
type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "ResourceScreen">
export function Research({ id }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { ipfsGateway } = useSettingsContext();
  const { research } = useGetResearch({ researchId: id });

  function handleGoToPdfView() {
    navigation.navigate("PdfViewScreen", {
      uri: `${ipfsGateway}/ipfs/${research?.file}`
    });
  }

  return (
    <View className="p-3 gap-3">
      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("resourceScreen.researchData")}
        </Text>

        <DataItem title="ID" value={id} />
        <DataItem title={t("resourceScreen.createdAt")} value={research?.createdAt} />
        <DataItem title="Era" value={research?.era} />
        <DataItem title={t("resourceScreen.invalidatedAt")} value={research?.invalidatedAt} />
        <DataItem title={t("resourceScreen.validationsCount")} value={research?.validationsCount} />
        <DataItem title="Valid" value={research?.valid.toString()} />
      </View>

      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("common.title")}
        </Text>

        <Text className="text-white">{research?.title}</Text>

        <Text className="text-gray-300 text-sm mt-3">
          {t("common.thesis")}
        </Text>

        <Text className="text-white">{research?.thesis}</Text>
      </View>

      <Researcher address={research?.researcher ? research.researcher : ""} />

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
            {t("resourceScreen.seeResearch")}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-300 text-sm">
          Hash
        </Text>
        <Text className="text-white text-sm">{research?.file}</Text>
      </View>
    </View>
  )
}
