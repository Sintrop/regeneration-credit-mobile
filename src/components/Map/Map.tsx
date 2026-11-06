import { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Camera, MapView, PointAnnotation, StyleURL, UserLocation, UserTrackingMode } from "@rnmapbox/maps";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { CoordinateProps } from "@domain";
import { usePermissions } from "@hooks";

import { Polyline } from "./Polyline";

const BRAZIL_CENTER: [number, number] = [-51.9253, -14.235];
const BRAZIL_ZOOM = 3;
const FIT_PADDING = 40;

function filterValidCoords(coords?: CoordinateProps[]): CoordinateProps[] {
  return (coords ?? []).filter(c =>
    Number.isFinite(c?.latitude) &&
    Number.isFinite(c?.longitude) &&
    c.latitude !== 0 &&
    c.longitude !== 0
  );
}

function fitCameraToCoords(camera: Camera | null, coords: CoordinateProps[], zoom: number) {
  if (!camera || coords.length === 0) return;

  if (coords.length === 1) {
    camera.setCamera({
      centerCoordinate: [coords[0].longitude, coords[0].latitude],
      zoomLevel: zoom,
      animationDuration: 0,
    });
    return;
  }

  const longitudes = coords.map(c => c.longitude);
  const latitudes = coords.map(c => c.latitude);
  camera.fitBounds(
    [Math.max(...longitudes), Math.max(...latitudes)],
    [Math.min(...longitudes), Math.min(...latitudes)],
    FIT_PADDING,
    0,
  );
}

interface Props {
  coords?: CoordinateProps[];
  label?: string;
  description?: string;
  description2?: string;
  description3?: string;
  onChangeCoords?: (coords: CoordinateProps[]) => void;
  showMarkers?: boolean;
  showPolyline?: boolean;
  collectCoords?: boolean;
  showDeleteButtons?: boolean;
  mapStyle?: ViewStyle;
  zoom?: number;
  disableScroll?: (disabled: boolean) => void;
  showMyLocation?: boolean;
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
  description2,
  description3,
  label,
  disableScroll,
  showMyLocation
}: Props) {
  const { t } = useTranslation();
  const cameraRef = useRef<Camera>(null);
  const [markers, setMarkers] = useState<CoordinateProps[]>([]);
  const [pathPolyline, setPathPolyline] = useState<[number, number][]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { locationStatus } = usePermissions();

  const validCoords = useMemo(() => filterValidCoords(coords), [coords]);
  const followUser = !!showMyLocation && locationStatus === 'granted';

  useEffect(() => {
    setMarkers(validCoords);
  }, [validCoords])

  useEffect(() => {
    if (markers.length > 0) {
      createPathPolyline();
    } else {
      setPathPolyline([]);
    }

    if (onChangeCoords) onChangeCoords(markers);
  }, [markers])

  // The camera is only positioned after the map finishes loading: on iOS a
  // camera set before the style loads is overridden by the style's default
  // center, which made the map open in Manhattan.
  useEffect(() => {
    if (!mapLoaded || followUser || validCoords.length === 0) return;
    fitCameraToCoords(cameraRef.current, validCoords, zoom);
  }, [mapLoaded, followUser, validCoords, zoom])

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

      <View className="gap-2">
        {description && (
          <Text className="text-white">{description}</Text>
        )}
        {description2 && (
          <Text className="text-white">{description2}</Text>
        )}
        {description3 && (
          <Text className="text-white">{description3}</Text>
        )}
      </View>

      <MapView
        style={mapStyle}
        styleURL={StyleURL.SatelliteStreet}
        onDidFinishLoadingMap={() => setMapLoaded(true)}
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
        {followUser ? (
          <>
            <Camera
              followUserLocation={true}
              followUserMode={UserTrackingMode.Follow}
              followZoomLevel={18}
            />
            <UserLocation showsUserHeadingIndicator minDisplacement={1} />
          </>
        ) : (
          <Camera
            ref={cameraRef}
            defaultSettings={
              validCoords.length > 0
                ? { centerCoordinate: [validCoords[0].longitude, validCoords[0].latitude], zoomLevel: zoom }
                : { centerCoordinate: BRAZIL_CENTER, zoomLevel: BRAZIL_ZOOM }
            }
          />
        )}

        {markers.length > 0 && (
          <>
            {showMarkers && (
              <>
                {markers.map((item, index) => (
                  <PointAnnotation
                    id={`marker-${index}`}
                    coordinate={[item?.longitude, item?.latitude]}
                    key={`marker-${index}`}
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
