import { View } from "react-native";
import ContentLoader, { Rect } from 'react-content-loader/native';

import { Text } from "@components";

interface Props {
  label: string;
  value?: number | string;
  suffix?: string;
  isLoading?: boolean;
}
export function ImpactItem({ label, value, suffix, isLoading }: Props) {
  return (
    <View className="flex-1 p-3 rounded-2xl bg-card-primary">
      {isLoading ? (
        <Loading />
      ) : (
        <Text 
          className="text-white text-lg font-semibold" 
          numberOfLines={1}
        >
          {value} {suffix && suffix}
        </Text>
      )}
      <Text className="text-gray-300 text-sm">{label}</Text>
    </View>
  )
}

function Loading() {
  return (
    <ContentLoader
      speed={1}
      width={100}
      height={25}
      viewBox={`0 0 100 25`}
      backgroundColor="#012939"
      foregroundColor="#ecebeb"
    >
      <Rect x="1" y="1" rx="3" ry="3" width="100" height="15" /> 
    </ContentLoader>
  )
}
