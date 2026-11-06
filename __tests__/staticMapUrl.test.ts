import { staticAreaMapUrl } from '../src/utils/staticMapUrl';

const square = [
  { latitude: -22.5, longitude: -45.1 },
  { latitude: -22.5, longitude: -45.099 },
  { latitude: -22.499, longitude: -45.099 },
];

describe('staticAreaMapUrl', () => {
  it('builds a closed polygon overlay framed automatically', () => {
    const url = staticAreaMapUrl(square, { token: 'pk.test' }) as string;
    expect(url).toContain('/auto/600x300@2x');
    expect(url).toContain('access_token=pk.test');
    const geojson = JSON.parse(decodeURIComponent(url.split('geojson(')[1].split(')/auto')[0]));
    const ring = geojson.geometry.coordinates[0];
    expect(ring).toHaveLength(4);
    expect(ring[0]).toEqual(ring[3]);
    expect(ring[0]).toEqual([-45.1, -22.5]);
  });

  it('returns null without a polygon or a token', () => {
    expect(staticAreaMapUrl(square.slice(0, 2), { token: 'pk.test' })).toBeNull();
    expect(staticAreaMapUrl(square, { token: '' })).toBeNull();
  });
});
