import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { check, request, openSettings, PERMISSIONS, RESULTS, Permission } from "react-native-permissions";

type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited';

export function usePermissions() {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>();
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>();

  useEffect(() => {
    checkCameraPermission();
    checkLocationPermission();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkCameraPermission();
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getPermission = useCallback(async (permission: Permission, setStatus: (status: PermissionStatus) => void) => {
    const result = await request(permission);
    setStatus(result);
    if (result === RESULTS.BLOCKED) {
      openSettings();
    }
    return result;
  }, []);

  const checkPermission = useCallback(async (permission: Permission) => {
    return await check(permission);
  }, []);

  const requestCameraPermission = useCallback(() => {
    const permission =
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    return getPermission(permission, setCameraStatus);
  }, [getPermission]);

  const checkCameraPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

    const permissionStatus = await checkPermission(permission);
    setCameraStatus(permissionStatus);

    return permissionStatus;
  }, [checkPermission]);

  const requestLocationPermission = useCallback(() => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    return getPermission(permission, setLocationStatus);
  }, [getPermission]);

  const checkLocationPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const permissionStatus = await checkPermission(permission);
    setLocationStatus(permissionStatus);

    return permissionStatus;
  }, [checkPermission]);

  return {
    cameraStatus,
    locationStatus,
    requestCameraPermission,
    requestLocationPermission,
    checkLocationPermission,
    checkCameraPermission
  }
}