import { View } from "react-native";

import { BaseRegistrationProps } from "./UserRegistration";
import { Map } from "@components";

export function Regenerator({}: BaseRegistrationProps) {
  return (
    <View>
      <Map
        mapStyle={{ width: '100%', height: 300 }} 
        showMarkers 
        showPolyline 
        collectCoords 
        showDeleteButtons
      />
    </View>
  )
}
