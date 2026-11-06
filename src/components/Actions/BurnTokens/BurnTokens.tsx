import { Children, cloneElement, isValidElement, ReactNode, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { BurnTokensModalContent } from "./BurnTokensModalContent/BurnTokensModalContent";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
}

export function BurnTokens({ children }: Props) {
  const { t } = useTranslation();
  
  const offsetModal = useRef<Modalize>(null);

  function onBurned() {
    Toast.show({
      type: 'success',
      text1: t('actions.burnedTokens')
    });
    closeModal();
  }

  function openModal() {
    offsetModal.current?.open();
  }

  function closeModal() {
    offsetModal.current?.close();
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
          ref={offsetModal}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <BurnTokensModalContent onDone={onBurned} />
        </Modalize>
      </Portal>
    </View>
  );
}
