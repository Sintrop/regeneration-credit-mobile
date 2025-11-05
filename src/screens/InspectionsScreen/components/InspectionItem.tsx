import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Config from 'react-native-config';

import { Icon, InspectionStatus, Text, AcceptInspection } from "@components";
import { InspectionProps, useBlockNumber, useGetInspection } from "@domain";
import { AppStackParamsList } from "@routes";
import { useTxContext, useUserContext } from "@hooks";

import { Regenerator } from "./Regenerator";
import { Inspector } from "./Inspector";
import { InspectionLoading } from "./InspectionLoading";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, 'InspectionsScreen'>
interface Props {
  inspectionId: number;
}
export function InspectionItem({ inspectionId }: Props) {
  const { userType } = useUserContext();
  const { registerContinueAction } = useTxContext();
  const { t } = useTranslation();
  const { inspection, isLoading, refetch } = useGetInspection({ inspectionId });
  const { blockNumber } = useBlockNumber();

  const createdAt = inspection?.createdAt ?? 0;
  const acceptedAt = inspection?.acceptedAt ?? 0;
  const blocksToExpire = parseInt(Config.BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION);
  const delayToAccept = parseInt(Config.ACCEPT_INSPECTION_DELAY_BLOCKS);
  const canAcceptBlock = createdAt + delayToAccept;
  const canAccept = canAcceptBlock < blockNumber ? true : false;
  const canAcceptIn = canAcceptBlock - blockNumber;
  const expireBlock = acceptedAt + blocksToExpire
  const expireIn = expireBlock - blockNumber ;

  useEffect(() => {
    registerContinueAction(() => {
      refetch();
    })
  }, []);

  if (!inspection || isLoading) {
    return (
      <InspectionLoading />
    )
  }

  return (
    <View className="w-full p-3 rounded-2xl bg-card-primary mb-3 relative gap-3">
      <Text className="text-white font-semibold">
        {t('inspections.inspection')} #{inspectionId}
      </Text>

      <View className="absolute top-4 right-4 flex-row items-center gap-3">
        {inspection.status === 'accepted' && (
          <Text className="text-yellow-500">
            {t('inspections.expireIn')} {expireIn} {t('common.blocks')}
          </Text>
        )}
        {inspection.status === 'expired' && (
          <Text className="text-orange-500">
            {t('inspections.expired')} {Math.abs(expireIn)} {t('common.blocks')} {t('common.ago')}
          </Text>
        )}
        <InspectionStatus status={inspection.status} />
      </View>

      <Regenerator address={inspection?.regenerator} />

      {inspection.status !== 'open'  && (
        <Inspector address={inspection?.inspector} />
      )}

      {userType === 2 && (
        <>
          {inspection.status === 'open'  && (
            <View className="mt-1 pt-3 w-full border-t border-card-secondary">
              {canAccept ? (
                <AcceptInspection
                  inspectionIdProp={inspectionId}
                >
                  <AcceptButton label={t('inspections.acceptInspection')}/>
                </AcceptInspection>
              ) : (
                <Text className="text-yellow-500 text-center mb-2">
                  {t('inspections.thisInspectionCanAcceptIn')} {canAcceptIn} {t('common.blocks')}
                </Text>
              )}
            </View>
          )}
    
          {inspection.status === 'expired'  && (
            <View className="mt-1 pt-3 w-full border-t border-card-secondary">
              <AcceptInspection
                inspectionIdProp={inspectionId}
              >
                <AcceptButton label={t('inspections.acceptInspection')}/>
              </AcceptInspection>
            </View>
          )}
        </>
      )}

      {inspection.status === 'realized' && (
        <View className="mt-1 pt-3 border-t border-card-secondary flex-row items-center justify-between h-[100]">
          <InspectionResult inspection={inspection} />
        </View>
      )}

      {inspection.status === 'invalidated' && (
        <View className="mt-1 pt-3 border-t border-card-secondary flex-row items-center justify-between h-[100]">
          <InspectionResult inspection={inspection} />
        </View>
      )}
    </View>
  )
}

interface InspectionResultProps {
  inspection: InspectionProps;
}
export function InspectionResult({ inspection }: InspectionResultProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();

  function handleGoToResource() {
    navigation.navigate("ResourceScreen", {
      id: inspection.id,
      resourceType: 'inspection'
    })
  }

  return (
    <>
      <View className="flex-row gap-3">
        <ResultItem title={t('inspections.score')} value={inspection.regenerationScore} />
        <ResultItem title={t('common.trees')} value={inspection.treesResult} />
        <ResultItem title={t('common.biodiversity')} value={inspection.biodiversityResult} />
      </View>

      <TouchableOpacity
        className="w-20 h-full p-3 bg-blue-500 items-center justify-center rounded-2xl gap-2"
        onPress={handleGoToResource}
      >
        <Icon name="arrowRight"/>
        <Text className="text-white text-center">{t('inspections.seeInspection')}</Text>
      </TouchableOpacity>
    </>
  )
}

interface ResultItemProps {
  title: string;
  value?: string | number;
}
function ResultItem({ title, value }: ResultItemProps) {
  return (
    <View className="w-20 p-3 border-2 border-white rounded-2xl items-center">
      <Text className="font-bold text-white text-xl">{value}</Text>
      <Text className="text-xs text-white text-center">{title}</Text>
    </View>
  )
}

interface AcceptButtonProps {
  openModal?: () => void;
  label: string;
}
function AcceptButton({ openModal, label }: AcceptButtonProps) {
  return (
    <TouchableOpacity
      onPress={openModal}
      className="items-center justify-center flex-row gap-2 bg-green-500 w-full h-12 rounded-2xl"
    >
      <Text className="text-white font-semibold">
        {label}
      </Text>
    </TouchableOpacity>
  )
}
