const EARTH_RADIUS_METERS = 6378137;

export const MIN_REGENERATION_AREA = 2500;
export const MAX_REGENERATION_AREA = 1000000;
export const MIN_REGENERATION_COORDINATES = 3;
export const MAX_REGENERATION_COORDINATES = 10;

interface RegenerationAreaValidation {
  coordinatesCount: number;
  areaSize: number;
}

/** Mirrors the RegeneratorRules.addRegenerator requirements for the area and its coordinates. */
export function isValidRegenerationArea({ coordinatesCount, areaSize }: RegenerationAreaValidation): boolean {
  return (
    coordinatesCount >= MIN_REGENERATION_COORDINATES &&
    coordinatesCount <= MAX_REGENERATION_COORDINATES &&
    areaSize >= MIN_REGENERATION_AREA &&
    areaSize <= MAX_REGENERATION_AREA
  );
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Geodesic area of a polygon on the WGS84 sphere, in square meters (rounded up).
 * Same spherical-excess formula used by turf.js and the Google Maps geometry library,
 * so the result does not depend on latitude the way a projected (Mercator) area does.
 */
export function calculateArea(coords: { latitude: number; longitude: number }[]): number {
  if (coords.length < 3) return 0;

  let total = 0;
  for (let i = 0; i < coords.length; i++) {
    const current = coords[i];
    const next = coords[(i + 1) % coords.length];

    total +=
      toRadians(next.longitude - current.longitude) *
      (2 + Math.sin(toRadians(current.latitude)) + Math.sin(toRadians(next.latitude)));
  }

  const areaM2 = Math.abs((total * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2);
  return Math.ceil(areaM2);
}
