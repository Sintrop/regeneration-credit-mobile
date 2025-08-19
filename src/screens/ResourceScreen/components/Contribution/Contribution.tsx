import { TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { DataItem, Icon, Text } from "@components";
import { useGetContribution } from "@domain";
import { AppStackParamsList } from "@routes";
import { useSettingsContext } from "@hooks";
import { Contributor } from "./Contributor";


interface Props {
  id: number
}
type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "ResourceScreen">
export function Contribution({ id }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { ipfsGateway } = useSettingsContext();
  const { contribution } = useGetContribution({ contributionId: id });

  function handleGoToPdfView() {
    navigation.navigate("PdfViewScreen", {
      uri: `${ipfsGateway}/ipfs/${contribution?.report}`
    });
  }

  return (
    <View className="p-3 gap-3">
      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("resourceScreen.contributionData")}
        </Text>

        <DataItem title="ID" value={id} />
        <DataItem title={t("resourceScreen.createdAt")} value={contribution?.createdAt} />
        <DataItem title="Era" value={contribution?.era} />
        <DataItem title={t("resourceScreen.invalidatedAt")} value={contribution?.invalidatedAt} />
        <DataItem title={t("resourceScreen.validationsCount")} value={contribution?.validationsCount} />
        <DataItem title="Valid" value={contribution?.valid.toString()} />
      </View>

      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("common.description")}
        </Text>

        <Text className="text-white">{contribution?.description}</Text>
      </View>

      <Contributor address={contribution?.contributor ? contribution.contributor : ""} />

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
            {t("resourceScreen.seeContribution")}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-300 text-sm">
          Hash
        </Text>
        <Text className="text-white text-sm">{contribution?.report}</Text>
      </View>
    </View>
  )
}
