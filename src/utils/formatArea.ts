const M2_PER_HECTARE = 10000;
/** From 0.1 ha up, areas read better in hectares; tiny values (impact per credit) stay in m². */
const HECTARE_THRESHOLD_M2 = 1000;

export function formatArea(squareMeters: number, locale: string): string {
  const value = Number.isFinite(squareMeters) ? squareMeters : 0;
  if (Math.abs(value) >= HECTARE_THRESHOLD_M2) {
    return `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value / M2_PER_HECTARE)} ha`;
  }
  return `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} m²`;
}
