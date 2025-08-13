import { ReactNode } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@components";

//@ts-ignore
import RCIcon from "../../assets/images/rc.png";
import { useNavigation } from "@react-navigation/native";

export interface HeaderProps {
  home?: boolean;
  title?: string;
  showBackButton?: boolean;
}

function Container({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between px-5 h-20 w-full bg-green-header">
      {children}
    </View>
  )
}

export function Header({ home, title, showBackButton }: HeaderProps) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

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
    <Container>
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            className="w-5 h-5 bg-white"
            onPress={handleGoBack}
          >

          </TouchableOpacity>
        )}
      </View> 

      <Text className="text-white font-bold">{title}</Text>
      
      <View className="w-10"/>
    </Container>
  )
}