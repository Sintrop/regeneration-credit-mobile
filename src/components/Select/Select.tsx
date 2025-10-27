import { useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { useAppSafeArea } from "@hooks";

interface OptionProps {
  value: any;
  label: string;
  default?: boolean;
}
interface Props {
  options: OptionProps[];
  value: any;
  label?: string;
  onChange: (value: any) => void;
}
export function Select({ onChange, options, value, label }: Props) {
  const { bottom } = useAppSafeArea();
  const { t } = useTranslation();
  const selectedOption = options.find((option) => option.value === value);
  const modalRef = useRef<Modalize>(null);

  function handleOpenModal() {
    modalRef.current?.open();
  }

  function handleCloseModal() {
    modalRef.current?.close();
  }

  function handleItemSelected(value: any) {
    handleCloseModal();
    onChange(value);
  }

  return (
    <View>
      {label && (
        <Text className="text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <TouchableOpacity
        className="w-full h-12 rounded-2xl flex-row items-center justify-between px-3 bg-card-secondary"
        onPress={handleOpenModal}
      >
        <Text className="text-white">{selectedOption?.label}</Text>
        <Icon name="arrowDown" />
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="bg-card-primary rounded-t-3xl p-5 max-h-[300]" 
            style={{ paddingBottom: bottom }}
          >
            <Text className="text-white text-center mb-5">{t('select.selectAnOption')}</Text>

            <ScrollView className="pb-14">
              {options.map((item, index) => {
                if (!item.default) {
                  return (
                    <TouchableOpacity 
                      key={index}
                      className="w-full h-12 flex-row items-center border-b border-card-secondary"
                      onPress={() => handleItemSelected(item.value)}
                    >
                      <Text className="text-white">{item.label}</Text>
                    </TouchableOpacity>
                  )
                }
              })}
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </View>
  ) 
}