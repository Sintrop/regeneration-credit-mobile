import { View } from "react-native";

import { Avatar, Text } from "@components";
import { Loading } from "./Loading";

interface Props {
  address?: string;
  name?: string;
  isLoading?: boolean;
  photo?: string;
  createdAt?: number;
}
export function HeaderItem({ address, name, photo, createdAt, isLoading }: Props) {
  if (isLoading){
    return <Loading />
  }
  
  return (
    <View className="flex-row w-full gap-3">
      <Avatar address={address ? address : ""} photoHash={photo} size={50} />

      <View className="mt-[-3]">
        <Text className="font-bold text-white">{name}</Text>
        <Text className="text-white text-sm">{address}</Text>
        <Text className="text-white text-xs">{createdAt}</Text>
      </View>
    </View>
  )
}