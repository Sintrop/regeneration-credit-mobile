import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import { CalculatorItemProps } from "@domain";
import { OffsetModalContent } from "./OffsetModalContent/OffsetModalContent";
import { SelectItem } from "./SelectItem";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
  item?: CalculatorItemProps
}

export function Offset({ children, item }: Props) {
  const [selectedItem, setSelectedItem] = useState<CalculatorItemProps | null>(null);
  const offsetModal = useRef<Modalize>(null);

  useEffect(() => {
    if (item) setSelectedItem(item);
  }, [item]);

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
          {selectedItem ? (
            <OffsetModalContent item={selectedItem} />
          ) : (
            <SelectItem onSelect={setSelectedItem} />
          )}
        </Modalize>
      </Portal>
    </View>
  );
}
