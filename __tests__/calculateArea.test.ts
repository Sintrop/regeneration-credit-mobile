import { calculateArea, isValidRegenerationArea } from '../src/services/calculateArea';

const METERS_PER_DEGREE_LAT = 111320;

function square(latitude: number, longitude: number, sideMeters: number) {
  const dLat = sideMeters / METERS_PER_DEGREE_LAT;
  const dLon = sideMeters / (METERS_PER_DEGREE_LAT * Math.cos((latitude * Math.PI) / 180));
  return [
    { latitude, longitude },
    { latitude, longitude: longitude + dLon },
    { latitude: latitude + dLat, longitude: longitude + dLon },
    { latitude: latitude + dLat, longitude },
  ];
}

describe('calculateArea', () => {
  it('returns 0 for fewer than 3 points', () => {
    expect(calculateArea([])).toBe(0);
    expect(calculateArea(square(-22.5, -47, 100).slice(0, 2))).toBe(0);
  });

  it.each([-3, -15, -22.5, -30])('measures a 1 ha square at latitude %p within 1%%', latitude => {
    const area = calculateArea(square(latitude, -47, 100));
    expect(area).toBeGreaterThan(9900);
    expect(area).toBeLessThan(10100);
  });

  it('does not depend on point order', () => {
    const coords = square(-22.5, -47, 100);
    expect(calculateArea([...coords].reverse())).toBe(calculateArea(coords));
  });
});

describe('isValidRegenerationArea', () => {
  it('accepts the contract limits', () => {
    expect(isValidRegenerationArea({ coordinatesCount: 3, areaSize: 2500 })).toBe(true);
    expect(isValidRegenerationArea({ coordinatesCount: 10, areaSize: 1000000 })).toBe(true);
  });

  it('rejects areas outside 2,500 to 1,000,000 m²', () => {
    expect(isValidRegenerationArea({ coordinatesCount: 4, areaSize: 2499 })).toBe(false);
    expect(isValidRegenerationArea({ coordinatesCount: 4, areaSize: 1000001 })).toBe(false);
  });

  it('rejects fewer than 3 or more than 10 coordinates', () => {
    expect(isValidRegenerationArea({ coordinatesCount: 2, areaSize: 5000 })).toBe(false);
    expect(isValidRegenerationArea({ coordinatesCount: 11, areaSize: 5000 })).toBe(false);
  });
});
