import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InspectionProps } from "@domain";
import { Icon, Text } from "@components";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, 'UserDetailsScreen'>
interface Props {
  inspection: InspectionProps
}
export function InspectionItem({ inspection }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();

  function handleGoToInspection() {
    navigation.navigate('ResourceScreen', {
      id: inspection.id,
      resourceType: 'inspection'
    })
  }

  return (
    <View className="w-full py-3 border-b border-card-secondary">
      <Text className="text-white font-semibold">{t('profile.inspection')} #{inspection.id}</Text>
      <View className="flex-row justify-between gap-5 mt-3">
        <ResultItem 
          title={t("feed.rScore")}
          value={inspection.regenerationScore}
        />

        <ResultItem 
          title={t("common.biodiversity")}
          value={inspection.biodiversityResult}
        />

        <ResultItem 
          title={t("common.trees")}
          value={inspection.treesResult}
        />
      </View>

      <TouchableOpacity
        className="w-full h-10 rounded-2xl bg-blue-primary items-center justify-center flex-row gap-3 mt-3"
        onPress={handleGoToInspection}
        hitSlop={5}
      >
        <Text className="font-semibold text-white">{t('profile.seeMore')}</Text>
        <Icon name="arrowRight" />
      </TouchableOpacity>
    </View>
  );
}

interface ResultItemProps {
  title: string;
  value: string | number;
}
function ResultItem({ title, value }: ResultItemProps) {
  return (
    <View className="w-28 p-3 border-2 border-white rounded-2xl items-center">
      <Text className="font-bold text-white text-xl">{value}</Text>
      <Text className="text-sm text-white text-center">{title}</Text>
    </View>
  )
}
