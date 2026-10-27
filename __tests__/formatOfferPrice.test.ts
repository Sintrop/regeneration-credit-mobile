import { formatOfferPrice } from '../src/screens/MarketScreen/formatOfferPrice';

const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ');

describe('formatOfferPrice', () => {
  it('formats comma and dot decimals as BRL in the user locale', () => {
    expect(normalizeSpaces(formatOfferPrice('0,15', 'pt'))).toBe('R$ 0,15');
    expect(normalizeSpaces(formatOfferPrice('1.2', 'pt'))).toBe('R$ 1,20');
    expect(normalizeSpaces(formatOfferPrice('R$ 0,10', 'pt'))).toBe('R$ 0,10');
    expect(formatOfferPrice('0.8', 'en')).toBe('R$0.80');
  });

  it('keeps sub-cent precision', () => {
    expect(normalizeSpaces(formatOfferPrice('0,0825', 'pt'))).toBe('R$ 0,0825');
  });

  it('shows free text and implausible values as written', () => {
    expect(formatOfferPrice('8 centavos', 'pt')).toBe('8 centavos');
    expect(formatOfferPrice('1000000000000000000', 'pt')).toBe('1000000000000000000');
  });
});
