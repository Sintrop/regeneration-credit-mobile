import { ComponentType } from "react";
import { View } from "react-native";

import { ResourcesTypes } from "@database";

import { Inspection } from "./components/Inspection/Inspection";
import { Report } from "./components/Report/Report";
import { Research } from "./components/Research/Research";
import { Contribution } from "./components/Contribution/Contribution";
import { Offset } from "./components/Offset/Offset";
import { UserRegistered } from "./components/UserRegistered/UserRegistered";
import { DeclaredCommitment } from "./components/DeclaredCommitment/DeclaredCommitment";
import { PoolWithdrawal } from "./components/PoolWithdrawal/PoolWithdrawal";
import { Invitation } from "./components/Invitation/Invitation";
import { TreeFunding } from "./components/TreeFunding/TreeFunding";
import { RegeneratorEnteredPool } from "./components/RegeneratorEnteredPool/RegeneratorEnteredPool";
import { MarketOffer } from "./components/MarketOffer/MarketOffer";

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
    <View className="mx-3 mb-3 rounded-2xl bg-card-primary p-4">
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
  "user-registered": UserRegistered,
  "declared-commitment": DeclaredCommitment,
  "pool-withdrawal": PoolWithdrawal,
  invitation: Invitation,
  "tree-funding": TreeFunding,
  "regenerator-entered-pool": RegeneratorEnteredPool,
  "market-offer": MarketOffer
}
