import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppSafeArea, useUserContext } from "@hooks";
import { Text } from "@components";
import { useApprovedTokens } from "@domain";
import { ApproveTokens } from "./ApproveTokens";

export function OffsetModalContent() {
  const { address } = useUserContext();
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();

  const { isLoading, approvedTokens, refetch: refetchApprovedTokens } = useApprovedTokens({ address })

  return (
    <View 
      className="w-full p-5 bg-card-primary rounded-t-2xl"
      style={{ paddingBottom: bottom + 20 }}
    >
      <Text className="text-white text-center">{t('offset.title')}</Text>

      <Text className="text-white mt-10">
        {t('offset.description')}
      </Text>

      {isLoading ? (
        <View className="mt-5 items-center">
          <ActivityIndicator color="white" size={40} />
        </View>
      ) : (
        <>
          {approvedTokens < 1 ? (
            <ApproveTokens refetchApprovedTokens={refetchApprovedTokens} />
          ) : (
            <View></View>
          )}
        </>
      )}
    </View>
  )
}
