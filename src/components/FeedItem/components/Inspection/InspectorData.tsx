import { View } from "react-native";
import { useTranslation } from "react-i18next";
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

import { Avatar, Text } from "@components";
import { useGetInspector } from "@domain";

interface Props {
  address: string;
}
export function InspectorData({ address }: Props) {
  const { t } = useTranslation();
  const { inspector, isLoading } = useGetInspector({ address })

  return (
    <View className="gap-1">
      <Text className="text-sm text-gray-300">
        {t("common.inspector")}
      </Text>

      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-row items-center gap-2">
          <Avatar address={address} photoHash={inspector?.proofPhoto} size={30} />

          <Text className="text-white text-sm">{inspector?.name}</Text>
        </View>
      )}
    </View>
  )
}

function Loading() {
  return (
    <ContentLoader
      speed={2}
      width={200}
      height={30}
      viewBox={`0 0 ${200} 30`}
      backgroundColor="#012939"
      foregroundColor="#ecebeb"
    >
      <Circle cx="15" cy="15" r="15" /> 
      <Rect x="40" y="10" rx="3" ry="3" width="150" height="10" /> 
    </ContentLoader>
  )
}