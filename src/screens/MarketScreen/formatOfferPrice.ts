const MAX_REASONABLE_PRICE = 1_000_000;

/**
 * Offer prices are free text on-chain ("0,15", "1.2", "R$ 0,10"). When the text
 * is a plain number it is shown as BRL in the user's locale; anything else is
 * shown as written.
 */
export function formatOfferPrice(unitPrice: string, locale: string): string {
  const raw = unitPrice.trim();
  const numeric = raw.replace(/^R\$\s*/i, '').replace(',', '.');

  if (!/^\d+(\.\d+)?$/.test(numeric)) return raw;

  const value = Number(numeric);
  if (!Number.isFinite(value) || value > MAX_REASONABLE_PRICE) return raw;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
