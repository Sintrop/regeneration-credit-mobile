import { View } from "react-native";

import { BaseRegistrationProps } from "./UserRegistration";
import { Map } from "@components";

export function Regenerator({}: BaseRegistrationProps) {
  return (
    <View>
      <Map />
    </View>
  )
}
