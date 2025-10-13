import { InspectionProps } from "@domain";
import { View } from "react-native";

interface Props {
  inspection: InspectionProps
}

export function InspectionItem({}: Props) {
  return (
    <View className="w-full py-3 border-b border-card-secondary">

    </View>
  );
}