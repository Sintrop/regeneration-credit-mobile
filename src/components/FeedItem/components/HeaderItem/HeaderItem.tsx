import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Avatar, Text } from "@components";
import { AppStackParamsList } from "@routes";

import { Loading } from "./Loading";

interface Props {
  address?: string;
  name?: string;
  isLoading?: boolean;
  photo?: string;
  createdAt?: number;
}

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">
export function HeaderItem({ address, name, photo, createdAt, isLoading }: Props) {
  const navigation = useNavigation<NavigationProps>();

  function handleGoToUserDetails() {
    if (!address) return;
    navigation.navigate("UserDetailsScreen", { address });
  }

  if (isLoading){
    return <Loading />
  }
  
  return (
    <TouchableOpacity
      className="flex-row w-full gap-3 border-b pb-3 border-card-secondary"
      onPress={handleGoToUserDetails}
    >
      <Avatar address={address ? address : ""} photoHash={photo} size={50} />

      <View className="mt-[-3]">
        <Text className="font-bold text-white">{name}</Text>
        <Text className="text-white text-sm max-w-[95%]" numberOfLines={1}>{address}</Text>
        <Text className="text-white text-xs">{createdAt}</Text>
      </View>
    </TouchableOpacity>
  )
}