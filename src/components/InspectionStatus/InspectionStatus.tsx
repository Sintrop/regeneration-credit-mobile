import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { InspectionStatus as InspectionStatusType } from "@domain";
import { Text } from "@components";

interface Props {
  status: InspectionStatusType;
}

export function InspectionStatus({ status }: Props) {
  const { t } = useTranslation();

  if (status === 'open'){
    return (
      <View className="h-8 px-3 rounded-2xl items-center justify-center border-2 border-yellow-500">
        <Text className="font-semibold text-yellow-500">
          {t('inspectionStatus.open')}
        </Text>
      </View>
    )
  }

  if (status === 'accepted'){
    return (
      <View className="h-8 px-3 rounded-2xl items-center justify-center border-2 border-blue-500">
        <Text className="font-semibold text-blue-500">
          {t('inspectionStatus.accepted')}
        </Text>
      </View>
    )
  }

  if (status === 'realized'){
    return (
      <View className="h-8 px-3 rounded-2xl items-center justify-center border-2 border-green-500">
        <Text className="font-semibold text-green-500">
          {t('inspectionStatus.realized')}
        </Text>
      </View>
    )
  }

  if (status === 'invalidated'){
    return (
      <View className="h-8 px-3 rounded-2xl items-center justify-center border-2 border-red-500">
        <Text className="font-semibold text-red-500">
          {t('inspectionStatus.invalidated')}
        </Text>
      </View>
    )
  }

  if (status === 'expired'){
    return (
      <View className="h-8 px-3 rounded-2xl items-center justify-center border-2 border-orange-500">
        <Text className="font-semibold text-orange-500">
          {t('inspectionStatus.expired')}
        </Text>
      </View>
    )
  }

  return <View />
}
