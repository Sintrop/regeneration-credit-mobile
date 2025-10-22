import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { useDocumentPick } from "@hooks";

interface Props {
  label?: string;
  onChange: (uri: string) => void;
}
export function FileInput({ onChange, label }: Props) {
  const { t } = useTranslation();
  const { pick } = useDocumentPick();

  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handlePick() {
    const response = await pick()
    if (response.success) {
      if (response.document) {
        setFileName(response?.document?.name);
        setFileUri(response?.document?.uri);
        onChange(response?.document?.uri);
      }
    }
  }

  return (
    <View>
      {label && (
        <Text className="text-gray-300 mb-2">{label}</Text>
      )}

      {fileUri ? (
        <View className="flex-row items-center gap-3">
          <Icon name="file" color="white" />
          <Text className="text-white max-w-[50%]" numberOfLines={1}>{fileName}</Text>
          <TouchableOpacity
            className="px-5 h-8 rounded-2xl flex-row items-center justify-center bg-blue-primary"
            onPress={handlePick}
            hitSlop={5}
          >
            <Text className="font-semibold text-white">{t('fileInput.selectAnother')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="px-10 h-10 rounded-2xl flex-row items-center justify-center bg-blue-primary"
          onPress={handlePick}
          hitSlop={5}
        >
          <Text className="font-semibold text-white">{t('fileInput.selectFile')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
