interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Options {
  token: string;
  width?: number;
  height?: number;
}

/**
 * Mapbox Static Images URL with the regeneration area drawn as a polygon,
 * framed automatically ("auto"). Returns null when there is no valid polygon.
 */
export function staticAreaMapUrl(coords: Coordinate[], { token, width = 600, height = 300 }: Options): string | null {
  const valid = coords.filter(c => Number.isFinite(c.latitude) && Number.isFinite(c.longitude) && c.latitude !== 0 && c.longitude !== 0);
  if (valid.length < 3 || !token) return null;

  const ring = valid.map(c => [Number(c.longitude.toFixed(6)), Number(c.latitude.toFixed(6))]);
  ring.push(ring[0]);

  const feature = {
    type: "Feature",
    properties: { stroke: "#ff3b30", "stroke-width": 3, fill: "#75d63a", "fill-opacity": 0.08 },
    geometry: { type: "Polygon", coordinates: [ring] },
  };

  const overlay = `geojson(${encodeURIComponent(JSON.stringify(feature))})`;
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${overlay}/auto/${width}x${height}@2x?padding=40&access_token=${token}`;
}
