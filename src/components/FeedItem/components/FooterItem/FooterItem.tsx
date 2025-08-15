import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Text } from "@components";
import { ResourcesTypes } from "@screens";
import { AppStackParamsList } from "@routes";

interface Props {
  resourceType: ResourcesTypes;
  id: number;
}
type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">
export function FooterItem({ id, resourceType }: Props) {
  const navigation = useNavigation<NavigationProps>();
  
  function handleGoToResource() {
    navigation.navigate("ResourceScreen", {
      id,
      resourceType
    })
  }

  return (
    <View className="w-full border-t border-card-secondary pt-3 items-start">
      <Button
        title="See resource" 
        onPress={handleGoToResource}
      />
    </View>
  )
}

interface ButtonProps extends TouchableOpacityProps {
  title: string
}
function Button({ title, ...buttonProps}: ButtonProps) {
  return (
    <TouchableOpacity
      className="w-28 items-center gap-1"
      {...buttonProps}
    >
      <View className="w-5 h-5 bg-white"/>
      <Text className="font-bold text-white text-center">
        {title}
      </Text>
    </TouchableOpacity>
  )
}