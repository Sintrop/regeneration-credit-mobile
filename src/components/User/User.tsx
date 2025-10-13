import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Avatar, Text } from "@components";
import { Loading } from "./Loading";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamsList } from "@routes";

interface Props {
  address?: string;
  name?: string;
  isLoading?: boolean;
  photo?: string;
  createdAt?: number;
}

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">
export function User({ address, name, photo, isLoading }: Props) {
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
      className="flex-row w-full gap-3 py-2"
      onPress={handleGoToUserDetails}
    >
      <Avatar address={address ? address : ""} photoHash={photo} size={50} />

      <View className="mt-[-3]">
        <Text className="font-bold text-white">{name}</Text>
        <Text className="text-white text-sm">{address}</Text>
      </View>
    </TouchableOpacity>
  )
}