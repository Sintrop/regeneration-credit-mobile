import { View } from "react-native";
import Mapbox, {MapView} from "@rnmapbox/maps";

interface Props {

}
export function Map({}: Props) {
  return (
    <View >
      <MapView 
        style={{ width:300, height: 300}}
      >

      </MapView>
    </View>
  )
}
