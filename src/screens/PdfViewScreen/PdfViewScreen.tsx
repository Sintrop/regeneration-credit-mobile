import { StyleSheet, Dimensions, View, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from "react-i18next";
import Pdf from 'react-native-pdf';

import { Screen } from "@components";
import { AppStackParamsList } from '@routes';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "PdfViewScreen">
export function PdfViewScreen({ route }: ScreenProps) {
  const { uri } = route.params;
  const { t } = useTranslation();

  const source = { uri, cache: true };

  return (
    <Screen title={t("pdfView.title")} showBackButton>
      <View className="flex-1">
        <Pdf
          source={source}
          trustAllCerts={false}
          onLoadComplete={(numberOfPages, _filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uriPressed) => {
            Linking.openURL(uriPressed);
          }}
          style={styles.pdf}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  }
});