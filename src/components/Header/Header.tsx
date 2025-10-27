import { ReactNode } from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Avatar, Icon, Text } from "@components";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";

//@ts-ignore
import RCIcon from "../../assets/images/rc.png";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, 'HomeScreen'>

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
  const { isConnected, handleConnect, address, connecting } = useUserContext();
  const navigation = useNavigation<NavigationProps>();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleGoToProfile() {
    navigation.navigate('ProfileScreen', { address })
  }

  if (home) {
    return (
      <Container>
        <View className="flex-row items-center gap-3">
          <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
          <Text className="text-white">Regeneration Credit</Text>
        </View>

        <View className="flex items-center gap-3">
          {isConnected ? (
            <TouchableOpacity 
              className="flex-row items-center gap-2"
              onPress={handleGoToProfile}
            >
              <Text className="max-w-[80] text-white" numberOfLines={1}>{address}</Text>
              <Avatar address={address} size={25} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="h-8 w-32 items-center justify-center bg-green-500 rounded-2xl disabled:opacity-50"
              onPress={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <ActivityIndicator size={25} color="white" />
              ) : (
                <Text className="text-white">Connect</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            className=""
            onPress={handleGoBack}
          >
            <Icon name="chevronLeft" size={25}/>
          </TouchableOpacity>
        )}
      </View> 

      <Text className="text-white font-bold">{title}</Text>
      
      <View className="w-10"/>
    </Container>
  )
}