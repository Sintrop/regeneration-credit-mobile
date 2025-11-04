import { useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";

import { useAppSafeArea, useKeyboardStatus } from "@hooks";
import { Text } from "@components";
import { CalculatorItemProps, useCalculatorItemsList } from "@domain";

interface Props {
  onSelect: (item: CalculatorItemProps) => void;
}
export function SelectItem({ onSelect }: Props) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { keyboardHeight, keyboardOpen } = useKeyboardStatus();
  const paddingBottom = keyboardOpen ? keyboardHeight + 100 : bottom + 20;

  const { calculatorItems } = useCalculatorItemsList();
  const modalRef = useRef<Modalize>(null);

  return (
    <View 
      className="w-full p-5 bg-card-primary rounded-t-2xl"
      style={{ paddingBottom }}
    >
      <Text className="text-white text-center">{t('offset.title')}</Text>

      <Text className="text-white mt-10">
        {t('offset.newPubli')}
      </Text>

      <Text className="text-gray-300 text-sm mt-5 mb-1">{t('offset.selectAnItem')}</Text>
      <TouchableOpacity
        onPress={() => modalRef.current?.open()}
        className="px-10 h-10 rounded-2xl items-center justify-center gap-2 bg-green-500"
      >
        <Text className="text-white font-semibold">{t('offset.touchHereToSelect')}</Text>
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="w-full p-5 bg-card-primary rounded-t-2xl"
            style={{ paddingBottom }}
          >
            <Text className="text-white text-center">{t('offset.selectAnItem')}</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 500 }}
            >
              {calculatorItems.map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item)
                    modalRef.current?.close()
                  }}
                  className="h-12 justify-center px-3 border-b border-card-secondary"
                  key={item.id}
                >
                  <Text className="text-white">{item.item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </View>
  )
}
