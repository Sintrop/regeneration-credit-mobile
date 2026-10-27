import { useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";

import { changeAppLanguage } from "../../lang/i18n";
import { LanguageCode, SUPPORTED_LANGUAGES, resolveLanguage } from "../../lang/languages";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const current = resolveLanguage(i18n.language);

  function handleSelect(language: LanguageCode) {
    setVisible(false);
    changeAppLanguage(language);
  }

  return (
    <>
      <TouchableOpacity
        className="h-8 px-3 items-center justify-center rounded-2xl border border-white/40"
        onPress={() => setVisible(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.language')}
      >
        <Text className="text-white text-xs font-semibold">{current.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/60"
          onPress={() => setVisible(false)}
        >
          <View className="w-[80%] p-5 rounded-2xl bg-card-primary gap-2">
            <Text className="text-gray-300 text-sm mb-2">{t('common.language')}</Text>
            {SUPPORTED_LANGUAGES.map(language => (
              <TouchableOpacity
                key={language.code}
                className={`h-12 px-4 rounded-xl flex-row items-center justify-between ${language.code === current ? 'bg-green-600' : 'bg-card-secondary'}`}
                onPress={() => handleSelect(language.code)}
                accessibilityRole="button"
                accessibilityState={{ selected: language.code === current }}
              >
                <Text className="text-white font-semibold">{language.label}</Text>
                <Text className="text-white/70 text-xs">{language.code.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
