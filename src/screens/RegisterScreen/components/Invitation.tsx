/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserContext } from "@hooks";
import { useInvitation } from "@domain";

interface Props {
  userType: number;
  invitationIsOk: (isOk: boolean) => void;
}
export function Invitation({ userType, invitationIsOk }: Props) {
  const { address } = useUserContext();
  const { t } = useTranslation();
  const { invitation, isLoading } = useInvitation({ address });

  useEffect(() => {
    if (invitation) {
      if (invitation.userType === 0) {
        invitationIsOk(false);
      } else {
        if (invitation.userType === userType) {
          invitationIsOk(true);
        } else {
          invitationIsOk(false)
        }
      }
    } else {
      invitationIsOk(false);
    }
  }, [invitation])

  return (
    <View className="gap-2 p-3 rounded-2xl bg-card-primary">
      <Text className="text-gray-300">{t('register.invitationTitle')}</Text>
      <Text className="text-white">{t('register.invitationDescription')}</Text>

      {isLoading ? (
        <ActivityIndicator size={30} color="white" />
      ) : (
        <View className="gap-2">
          {invitation ? (
            <>
              <View>
                <Text className="text-gray-300 text-sm">{t('register.isThereAnInvitation')}</Text>
                {invitation?.userType === 0 ? (
                  <Text className="text-red-500">{t('common.no')}</Text>
                ) : (
                  <Text className="text-white">{t('common.yes')}</Text>
                )}
              </View>

              {invitation?.userType !== 0 && (
                <View>
                  <Text className="text-gray-300 text-sm">{t('common.activist')}</Text>
                  <Text className="text-white" numberOfLines={1}>{invitation?.inviter}</Text>

                  <Text className="text-gray-300 text-sm mt-3">{t('register.toRegisterAs')}</Text>
                  <Text className="text-white">{invitation?.userType}</Text>

                  {invitation?.userType !== userType && (
                    <Text className="text-red-500">{t('register.tryDiferentUserType')}</Text>
                  )}
                </View>
              )}
            </>
          ) : (
            <Text className="text-red-500">{t('register.youDoNotHaveAnInvitation')}</Text>
          )}
        </View>
      )}
    </View>
  );
}
