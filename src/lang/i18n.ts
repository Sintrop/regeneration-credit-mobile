import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, LanguageCode, isSupportedLanguage } from "./languages";

const LANGUAGE_STORAGE_KEY = "@regenerationcredit/language";

const resources = {
  en,
  pt,
  es,
};

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then(stored => {
    if (isSupportedLanguage(stored) && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
  })
  .catch(() => {});

export async function changeAppLanguage(language: LanguageCode) {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The choice still applies for this session.
  }
}

export default { i18n };
