import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";
import { Modalize } from "react-native-modalize";

import { Text } from "@components";
import { useAppSafeArea, useUserContext } from "@hooks";

import { SupporterActions } from "./SupporterActions";
import { ActivistActions } from "./ActivistActions";

export function Actions() {
  const { bottom } = useAppSafeArea();
  const { t } = useTranslation();
  const modalRef = useRef<Modalize>(null);

  const { userType } = useUserContext();
  const UserActions = userActions[userType as UserActions];

  function openModal() {
    modalRef.current?.open();
  }

  return (
    <View>
      <TouchableOpacity
        className="px-10 h-12 rounded-full bg-green-primary items-center justify-center elevation-lg"
        onPress={openModal}
      >
        <Text className="font-semibold text-white">
          {t('actions.title')}
        </Text>
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalRef}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="rounded-t-2xl p-5 bg-card-primary"
            style={{ paddingBottom: bottom + 20 }}
          >
            <Text className="text-white text-center">{t('actions.userActions')}</Text>

            <View className="mt-5">
              <UserActions />
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  )
}

interface ActionItemProps {
  label: string;
  onPress?: () => void;
}
export function ActionItem({ label, onPress }: ActionItemProps) {
  return (
    <TouchableOpacity
      className="w-full h-12 flex-row items-center px-2 border-b border-card-secondary"
      onPress={onPress}
    >
      <Text className="text-white">{label}</Text>
    </TouchableOpacity>
  )
}

const userActions = {
  0: SupporterActions,
  1: SupporterActions,
  2: SupporterActions,
  3: SupporterActions,
  4: SupporterActions,
  5: SupporterActions,
  6: SupporterActions,
  7: ActivistActions,
}
type UserActions = keyof typeof userActions;
