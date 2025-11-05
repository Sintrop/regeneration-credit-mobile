import { useEffect, useState } from "react"
import Geolocation, {
  GeoPosition,
  GeoError,
} from "react-native-geolocation-service";
import { usePermissions } from "./usePermissions";

export function useLocation() {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<GeoError | null>(null);
  const { locationStatus } = usePermissions();

  useEffect(() => {
    let watchId: number;

    async function startTracking() {
      if (locationStatus !== 'granted') {
        setError({
          code: 1,
          message: 'Permissão de localização negada.',
        } as GeoError);
        return;
      }

      watchId = Geolocation.watchPosition(
        (position) => {
          setLocation(position);
        },
        (err) => {
          setError(err)
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 3000,
          fastestInterval: 2000,
        }
      )
    }

    startTracking();

    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId)
      };
    };
  }, [locationStatus]);

  return { location, error }
}