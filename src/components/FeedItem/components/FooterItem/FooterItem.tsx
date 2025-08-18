import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Icon, IconsName, Text } from "@components";
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
        icon="file"
      />
    </View>
  )
}

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon: IconsName;
}
function Button({ title, icon, ...buttonProps}: ButtonProps) {
  return (
    <TouchableOpacity
      className="w-28 items-center gap-1"
      {...buttonProps}
    >
      <Icon name={icon} />
      <Text className="font-bold text-white text-center">
        {title}
      </Text>
    </TouchableOpacity>
  )
}