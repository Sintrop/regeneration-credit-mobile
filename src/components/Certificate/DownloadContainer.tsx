import { ReactNode, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";

interface Props {
  children: ReactNode;
}

export function DownloadContainer({ children }: Props) {
  const { t } = useTranslation();
  const viewShotRef = useRef<ViewShot>(null);

  function handleShare() {
    if (!viewShotRef.current?.capture) return;
    viewShotRef.current?.capture()
    .then((uri) => {
      Share.open({ url: uri })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-end w-full gap-5 mb-3">
        <TouchableOpacity 
          onPress={handleShare}
          className="flex-row items-center gap-2"
        >
          <Icon name="share" />
          <Text className="text-white">{t('common.share')}</Text>
        </TouchableOpacity>
      </View>
      <ViewShot
        ref={viewShotRef}
      >
        {children}
      </ViewShot>
    </View>
  )
}
