import { FALLBACK_LANGUAGE, isSupportedLanguage, resolveLanguage } from '../src/lang/languages';

describe('resolveLanguage', () => {
  it.each([
    ['pt-BR', 'pt'],
    ['pt_PT', 'pt'],
    ['es-419', 'es'],
    ['es_AR', 'es'],
    ['en_US', 'en'],
    ['EN', 'en'],
  ])('maps %p to %p', (locale, expected) => {
    expect(resolveLanguage(locale)).toBe(expected);
  });

  it('falls back to English for unsupported or missing locales', () => {
    expect(resolveLanguage('fr-FR')).toBe(FALLBACK_LANGUAGE);
    expect(resolveLanguage(undefined)).toBe(FALLBACK_LANGUAGE);
    expect(resolveLanguage('')).toBe(FALLBACK_LANGUAGE);
  });
});

describe('isSupportedLanguage', () => {
  it('only accepts the shipped languages', () => {
    expect(isSupportedLanguage('es')).toBe(true);
    expect(isSupportedLanguage('fr')).toBe(false);
    expect(isSupportedLanguage(null)).toBe(false);
  });
});
