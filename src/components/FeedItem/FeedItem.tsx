import { ComponentType } from "react";
import { View } from "react-native";
import { FeedItemTypes } from "@domain";
import { Inspection } from "./components/Inspection/Inspection";

export interface BaseComponentsProps {
  id: number
}

interface Props {
  type: FeedItemTypes;
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

const componentByType: Record<FeedItemTypes, ComponentType<BaseComponentsProps>> = {
  inspection: Inspection
}
