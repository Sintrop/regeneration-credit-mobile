import { ComponentType } from "react";
import { View } from "react-native";

import { ResourcesTypes } from "@database";

import { Inspection } from "./components/Inspection/Inspection";
import { Report } from "./components/Report/Report";
import { Research } from "./components/Research/Research";
import { Contribution } from "./components/Contribution/Contribution";

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
  report: Report,
  research: Research,
  contribution: Contribution
}
