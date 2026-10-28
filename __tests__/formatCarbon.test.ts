import { formatCarbon } from '../src/utils/formatCarbon';

describe('formatCarbon', () => {
  it('uses tonnes, kilograms or grams', () => {
    expect(formatCarbon(20390000, 'pt')).toBe('20,39 t');
    expect(formatCarbon(94000, 'pt')).toBe('94 kg');
    expect(formatCarbon(94, 'en')).toBe('94 g');
  });

  it('never shows negative or empty values', () => {
    expect(formatCarbon(-5, 'en')).toBe('0 g');
    expect(formatCarbon(NaN, 'en')).toBe('0 g');
  });
});
