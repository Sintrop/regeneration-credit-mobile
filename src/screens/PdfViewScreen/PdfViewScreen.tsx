import { useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from "react-i18next";
import Pdf from 'react-native-pdf';

import { Screen, Text } from "@components";
import { AppStackParamsList } from '@routes';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "PdfViewScreen">
export function PdfViewScreen({ route }: ScreenProps) {
  const { uri } = route.params;
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const source = { uri, cache: true };

  return (
    <Screen title={t("pdfView.title")} showBackButton>
      <View className="flex-1">
        {!error && (
          <Pdf
            source={source}
            trustAllCerts={false}
            onLoadProgress={setProgress}
            onLoadComplete={() => setLoaded(true)}
            onError={(e) => setError(String((e as Error)?.message ?? e))}
            onPressLink={(uriPressed) => {
              Linking.openURL(uriPressed);
            }}
            style={styles.pdf}
          />
        )}

        {!loaded && !error && (
          <View className="absolute inset-0 items-center justify-center gap-3 bg-green-secondary" pointerEvents="none">
            <ActivityIndicator color="white" size={30} />
            <Text className="text-gray-300">
              {progress > 0 ? t("pdfView.loadingProgress", { percent: Math.round(progress * 100) }) : t("pdfView.loading")}
            </Text>
          </View>
        )}

        {!!error && (
          <View className="flex-1 items-center justify-center px-8 gap-4">
            <Text className="text-white text-center font-semibold">{t("pdfView.errorTitle")}</Text>
            <Text className="text-gray-300 text-center text-sm">{t("pdfView.errorDescription")}</Text>
            <TouchableOpacity
              className="h-12 px-6 rounded-2xl items-center justify-center bg-green-primary"
              onPress={() => Linking.openURL(uri)}
            >
              <Text className="text-green-secondary font-bold">{t("pdfView.openInBrowser")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});
