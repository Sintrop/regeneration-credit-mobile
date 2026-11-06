import { Children, cloneElement, isValidElement, ReactNode, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import { Text } from "@components";
import { useAppSafeArea, useKeyboardStatus } from "@hooks";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  /** Trigger element; receives openModal / closeModal like the other actions. */
  children: ReactNode;
  title: string;
  description?: string;
  content: (controls: { close: () => void }) => ReactNode;
}

/** Bottom sheet used by the researcher, developer and contributor actions. */
export function ActionSheet({ children, title, description, content }: Props) {
  const { bottom } = useAppSafeArea();
  const { keyboardHeight, keyboardOpen } = useKeyboardStatus();
  const modal = useRef<Modalize>(null);

  const openModal = () => modal.current?.open();
  const closeModal = () => modal.current?.close();

  const trigger = Children.map(children, child =>
    isValidElement<ModalControls>(child) ? cloneElement(child, { openModal, closeModal }) : child
  );

  return (
    <View>
      {trigger}

      <Portal>
        <Modalize ref={modal} adjustToContentHeight modalStyle={{ backgroundColor: "transparent" }}>
          <View className="rounded-t-2xl p-5 bg-card-primary">
            <ScrollView
              style={{ maxHeight: 620 }}
              contentContainerStyle={{ paddingBottom: (keyboardOpen ? keyboardHeight : bottom) + 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="text-white text-center font-semibold">{title}</Text>
              {!!description && <Text className="text-gray-300 mt-4">{description}</Text>}
              <View className="mt-5 gap-4">{content({ close: closeModal })}</View>
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
