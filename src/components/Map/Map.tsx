import { useEffect, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import {Camera, MapView, PointAnnotation, StyleURL} from "@rnmapbox/maps";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { CoordinateProps } from "@domain";

import { Polyline } from "./Polyline";

interface Props {
  coords?: CoordinateProps[];
  label?: string;
  description?: string;
  onChangeCoords?: (coords: CoordinateProps[]) => void;
  showMarkers?: boolean;
  showPolyline?: boolean;
  collectCoords?: boolean;
  showDeleteButtons?: boolean;
  mapStyle?: ViewStyle;
  zoom?: number;
  disableScroll?: (disabled: boolean) => void;
}
export function Map({ 
  onChangeCoords, 
  collectCoords, 
  showMarkers, 
  showPolyline, 
  showDeleteButtons, 
  mapStyle, 
  coords, 
  zoom = 14,
  description,
  label,
  disableScroll
}: Props) {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<CoordinateProps[]>([]);
  const [pathPolyline, setPathPolyline] = useState<[number, number][]>([]);
  const [mapPosition, setMapPosition] = useState<CoordinateProps | null>();

  useEffect(() => {
    if(coords) setMarkers(coords)
  }, [coords])

  useEffect(() => {
    if (markers.length > 0) {
      createPathPolyline();
      setMapPosition(markers[0]);
    } else {
      setPathPolyline([]);
    }

    if (onChangeCoords) onChangeCoords(markers);
  }, [markers])

  function createPathPolyline() {
    let array: [number, number][] = [];
    for (var i = 0; i < markers.length; i++) {
      array.push([markers[i]?.longitude, markers[i]?.latitude]);
    }
    array.push([markers[0].longitude, markers[0].latitude]);
    setPathPolyline(array);
  }

  function handlePressMap(coord: CoordinateProps) {
    if (collectCoords) {
      setMarkers((value) => [...value, coord])
    }
  }

  function handleClearSelection() {
    setMarkers([]);
  }

  function handleRemoveLastPoint() {
    setMarkers((value) => value.slice(0, value.length - 1));
  }

  return (
    <View className="gap-2">
      {label && (
        <Text className="text-gray-300 text-sm">{label}</Text>
      )}

      {description && (
        <Text className="text-white">{description}</Text>
      )}

      <MapView
        style={mapStyle}
        styleURL={StyleURL.SatelliteStreet}
        onPress={(e) => {
          const coord = {
            //@ts-ignore
            latitude: e?.geometry?.coordinates[1],
            //@ts-ignore
            longitude: e?.geometry.coordinates[0],
          }

          handlePressMap(coord)
        }}
        onTouchStart={() => disableScroll && disableScroll(true)}
        onTouchEnd={() => disableScroll && disableScroll(false)}
        onTouchCancel={() => disableScroll && disableScroll(false)}
      >
        {mapPosition && (
          <Camera
            zoomLevel={zoom}
            centerCoordinate={[mapPosition?.longitude, mapPosition?.latitude]}
          />
        )}

        {markers.length > 0 && (
          <>
            {showMarkers && (
              <>
                {markers.map((item, index) => (
                  <PointAnnotation
                    id='marker'
                    coordinate={[item?.longitude, item?.latitude]}
                    key={index.toString()}
                    children={<View/>}
                  />
                ))}
              </>  
            )}

            {showPolyline && (
              <>
                <Polyline
                  coordinates={pathPolyline}
                  lineColor='red'
                  lineWidth={3}
                />
              </>
            )}
          </>
        )}
      </MapView>

      {showDeleteButtons && (
        <View className="flex-row gap-8 items-center justify-center mt-3">
          <TouchableOpacity
            onPress={handleClearSelection}
          >
            <Text className="text-white underline font-semibold">{t('map.clearSelection')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRemoveLastPoint}
          >
            <Text className="text-white underline font-semibold">{t('map.removeLastPoint')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
