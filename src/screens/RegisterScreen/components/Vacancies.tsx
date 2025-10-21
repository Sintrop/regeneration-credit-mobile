/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserTypesCount } from "@domain";
import { checkVacancies } from "@services";

interface Props {
  userType: number;
  vacancieIsOk: (isOk: boolean) => void;
}
export function Vacancies({ userType, vacancieIsOk }: Props) {
  const { t } = useTranslation();
  const { count: regeneratorsCount, isLoading: isLoadingRegenerators } = useUserTypesCount({ userType: 1 });
  const { count: userTypeCount, isLoading: isLoadingUserType } = useUserTypesCount({ userType });

  const [hasVacancie, setHasVacancie] = useState<boolean>(false);

  useEffect(() => {
    checkVacancie();
  }, [regeneratorsCount, userTypeCount]);

  async function checkVacancie() {
    const response = checkVacancies({ regeneratorsCount, userType, userTypeCount });
    setHasVacancie(response.availableVacancie);
    vacancieIsOk(response.availableVacancie);
  }

  return (
    <View className="gap-2 p-3 rounded-2xl bg-card-primary">
      <Text className="text-gray-300">{t('register.vacanciesTitle')}</Text>
      <Text className="text-white">{t('register.vacanciesDescription')}</Text>

      {isLoadingRegenerators || isLoadingUserType ? (
        <ActivityIndicator color="white" size={40} />
      ) : (
        <View>
          <Text className="text-gray-300">{t('register.isThereAnVacancie')}</Text>
          {hasVacancie ? (
            <Text className="text-white">{t('common.yes')}</Text>
          ) : (
            <Text className="text-red-500">{t('common.no')}</Text>
          )}
        </View>
      )}
    </View>
  );
}
