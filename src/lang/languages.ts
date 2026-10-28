export const SUPPORTED_LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

/** Language of a fresh install; most users are in Brazil. The choice in Settings is saved and wins after that. */
export const DEFAULT_LANGUAGE: LanguageCode = 'pt';

export const FALLBACK_LANGUAGE: LanguageCode = 'en';

export function isSupportedLanguage(value?: string | null): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some(language => language.code === value);
}

/** Maps a locale such as "pt-BR", "es_419" or "en_US" to a supported language. */
export function resolveLanguage(locale?: string | null): LanguageCode {
  const code = locale?.toLowerCase().split(/[-_]/)[0];
  return isSupportedLanguage(code) ? code : FALLBACK_LANGUAGE;
}
