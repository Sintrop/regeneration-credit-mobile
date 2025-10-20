import { Children, cloneElement, isValidElement, ReactNode, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import { CalculatorItemProps } from "@domain";
import { OffsetModalContent } from "./OffsetModalContent/OffsetModalContent";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
  item: CalculatorItemProps
}

export function Offset({ children }: Props) {
  
  const offsetModal = useRef<Modalize>(null);

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
          <OffsetModalContent />
        </Modalize>
      </Portal>
    </View>
  );
}
