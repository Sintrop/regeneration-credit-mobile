import { formatArea } from '../src/utils/formatArea';

describe('formatArea', () => {
  it('shows hectares from 1,000 m² up', () => {
    expect(formatArea(2196.97, 'pt')).toBe('0,22 ha');
    expect(formatArea(25000, 'pt')).toBe('2,5 ha');
    expect(formatArea(1000000, 'en')).toBe('100 ha');
  });

  it('keeps small values in m²', () => {
    expect(formatArea(0.0101, 'pt')).toBe('0,01 m²');
    expect(formatArea(999, 'en')).toBe('999 m²');
  });

  it('handles invalid values', () => {
    expect(formatArea(NaN, 'en')).toBe('0 m²');
  });
});
