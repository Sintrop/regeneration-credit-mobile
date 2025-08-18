import { ComponentType } from "react";
import { View } from "react-native";
import { Inspection } from "./components/Inspection/Inspection";
import { ResourcesTypes } from "@database";
import { Report } from "./components/Report/Report";

export interface BaseComponentsProps {
  id: number
}

interface Props {
  type: ResourcesTypes;
  id: number
}
export function FeedItem({ id, type }: Props) {
  const Component = componentByType[type];
  return (
    <View className="w-full bg-card-primary p-5">
      <Component id={id} />
    </View>
  )
}

const componentByType: Record<ResourcesTypes, ComponentType<BaseComponentsProps>> = {
  inspection: Inspection,
  report: Report
}
