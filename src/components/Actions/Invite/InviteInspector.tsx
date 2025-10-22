import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import { useAppSafeArea, useTxContext } from "@hooks";
import { Text, TextInput } from "@components";
import { useTranslation } from "react-i18next";
import { utils } from "web3";
import Toast from "react-native-toast-message";
import { useInvite } from "@domain";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
}

export function InviteInspector({ children }: Props) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { registerContinueAction } = useTxContext();
  const modal = useRef<Modalize>(null);

  const [walletToInvite, setWalletToInvite] = useState<string>('');
  const isAddress = utils.isAddress(walletToInvite);

  const { invite } = useInvite();

  useEffect(() => {
    registerContinueAction(() => {
      //action success
      Toast.show({
        type: 'success',
        text1: t('actions.inviteSent')
      });
      setWalletToInvite('');
      closeModal();
    })
  }, []);

  function handleInvite() {
    invite({
      address: walletToInvite,
      userType: 2
    })
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
            <Text className="text-white text-center">{t('actions.inviteInspector')}</Text>

            <View className="mt-5 gap-5">
              <Text className="text-white">{t('actionsDescriptions.inviteInspector')}</Text>

              <View className="gap-1">
                <TextInput
                  label={t('actions.walletWantToInvite')}
                  value={walletToInvite}
                  onChangeText={setWalletToInvite}
                />

                {walletToInvite.trim() && !isAddress && (
                  <Text className="text-red-500">{t('common.invalidAddress')}</Text>
                )}
              </View>

              <TouchableOpacity
                className="w-full h-12 rounded-2xl flex-row items-center justify-center bg-green-primary disabled:opacity-50"
                onPress={handleInvite}
                disabled={!walletToInvite.trim() || !isAddress}
              >
                <Text className="text-white font-semibold">{t('actions.invite')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
