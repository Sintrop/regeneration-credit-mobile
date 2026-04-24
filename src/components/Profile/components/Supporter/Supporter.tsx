import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetSupporter, useReductionCommitments, useCalculatorItemById } from "@domain";
import { Certificate, DataItem, Text } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";

function CommitmentItem({ itemId, address }: { itemId: number; address: string }) {
  const { item } = useCalculatorItemById(itemId, address);
  
  if (!item) return null;
  
  return (
    <View className="bg-card-secondary p-5 rounded-2xl">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-semibold flex-1">{item.item}</Text>
        <Text className="text-green-400 font-bold text-right ml-2">
          {item.tokensCompensated?.toFixed(2) || '0.00'} RC
        </Text>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-gray-300 text-sm">{item.carbonImpact} g CO₂/{item.unit}</Text>
        <Text className="text-green-400 text-sm">Impacto: {((item.totalImpact || 0) / 1000000).toFixed(6)} t CO₂</Text>
      </View>
    </View>
  );
}

interface Props {
  address: string
}
export function Supporter({ address }: Props) {
  const { t } = useTranslation();
  const { supporter, isLoading: isSupporterLoading, isError } = useGetSupporter({ address });
  const { commitments, isLoading: isCommitmentsLoading } = useReductionCommitments(address);

  if (isSupporterLoading) return <View/>

  if (!supporter || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={supporter?.name}
        photoHash={supporter?.profilePhoto}
        userType={7}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={supporter.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={supporter.profilePhoto} />
          <DataItem title={t("profile.registeredAt")} value={supporter.createdAt} />
        </View>

        <Invitation address={address} />

        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <Text className="font-bold text-white text-xl">
            {t("profile.certificates")}
          </Text>
          <Certificate address={address} type="supporter" />
        </View>

        {/* Reduction Commitments Section - Below Certificate */}
        {commitments.length > 0 && (
          <View className="gap-2 p-5 rounded-2xl bg-card-primary border border-green-500/50">
            <Text className="font-bold text-white text-xl">
              Compromissos de Redução Declarados
            </Text>
            {commitments.map((itemId, index) => (
              <CommitmentItem key={index} itemId={itemId} address={address} />
            ))}
          </View>
        )}

      </View>
    </View>
  )
}