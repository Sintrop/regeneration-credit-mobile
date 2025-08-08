import { ReactNode } from "react";
import { View, Image } from "react-native";
import { Text } from "@components";

//@ts-ignore
import RCIcon from "../../assets/images/rc.png";

export interface HeaderProps {
  home?: boolean
}

function Container({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between px-5 h-20 w-full bg-green-header">
      {children}
    </View>
  )
}
export function Header({ home }: HeaderProps) {
  if (home) {
    return (
      <Container>
        <View className="flex-row items-center gap-3">
          <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
          <Text className="text-white">Regeneration Credit</Text>
        </View>
      </Container>
    )
  }
  return (
    <View className="flex-row items-center justify-between px-5 h-20 w-full bg-green-header">

      <Text>Regeneration Credit</Text>
    </View>
  )
}