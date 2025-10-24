import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { useAppSafeArea, useTxContext } from "@hooks";
import { Text } from "@components";
import { useRequestInspection } from "@domain";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
}

export function RequestInspection({ children }: Props) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const modal = useRef<Modalize>(null);
  
  const { registerContinueAction } = useTxContext();
  const { requestInspection } = useRequestInspection();

  useEffect(() => {
    registerContinueAction(() => {
      //action success
      Toast.show({
        type: 'success',
        text1: t('actions.requestedInspection')
      });
      closeModal();
    })
  }, []);

  function handleAccept() {
    requestInspection();
  }

  function openModal() {
    modal.current?.open();
  }

  function closeModal() {
    modal.current?.close();
  }

  const enhancedChildren = Children.map(children, child => {
    if (isValidElement<ModalControls>(child)) {
      return cloneElement(child, { openModal, closeModal });
    }
    return child;
  });

  return (
    <View>
      {enhancedChildren}

      <Portal>
        <Modalize
          ref={modal}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="rounded-t-2xl p-5 bg-card-primary"
            style={{ paddingBottom: bottom + 20 }}
          >
            <Text className="text-white text-center">{t('actions.requestInspection')}</Text>

            <View className="mt-5 gap-5">
              <Text className="text-white">{t('actionsDescriptions.requestInspection')}</Text>

              <TouchableOpacity
                className="w-full h-12 rounded-2xl flex-row items-center justify-center bg-green-primary disabled:opacity-50"
                onPress={handleAccept}
              >
                <Text className="text-white font-semibold">{t('actions.requestInspection')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
