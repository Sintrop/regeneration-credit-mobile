import { ComponentType } from "react";
import { View } from "react-native";

import { ResourcesTypes } from "@database";

import { Inspection } from "./components/Inspection/Inspection";
import { Report } from "./components/Report/Report";
import { Research } from "./components/Research/Research";
import { Contribution } from "./components/Contribution/Contribution";
import { Offset } from "./components/Offset/Offset";
import { UserRegistered } from "./components/UserRegistered/UserRegistered";

export interface BaseComponentsProps {
  id: number;
  additionalData?: string;
}

interface Props {
  type: ResourcesTypes;
  id: number
  additionalData?: string;
}
export function FeedItem({ id, type, additionalData }: Props) {
  const Component = componentByType[type];
  return (
    <View className="w-full bg-card-primary p-5">
      <Component id={id} additionalData={additionalData} />
    </View>
  )
}

const componentByType: Record<ResourcesTypes, ComponentType<BaseComponentsProps>> = {
  inspection: Inspection,
  report: Report,
  research: Research,
  contribution: Contribution,
  offset: Offset,
  "user-registered": UserRegistered
}
