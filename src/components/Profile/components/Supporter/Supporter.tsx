import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  Compensation,
  useBlockNumber,
  useCalculatorItemById,
  useCertificatedTokens,
  useGetCalculatorItem,
  useGetSupporter,
  useImpactPerToken,
  useReductionCommitments,
  useSupporterCompensations,
} from "@domain";
import { Certificate, DataItem, Text } from "@components";
import { useBlocksDuration } from "@hooks";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";
import { InvitedUsers } from "../Sections/InvitedUsers";
import { formatArea } from "@utils";

function useFormat() {
  const { i18n } = useTranslation();
  return (value: number, digits = 2) =>
    Intl.NumberFormat(i18n.language, { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(value);
}

/** Total certified RC and its impact equivalents (impact per token from RegenerationCreditImpact). */
function ImpactSummary({ address, compensationsCount }: { address: string; compensationsCount: number }) {
  const { t, i18n } = useTranslation();
  const format = useFormat();
  const { certificated } = useCertificatedTokens({ address });
  const { area, biodiversity, carbon, trees } = useImpactPerToken();

  const items = [
    { label: t("supporterProfile.carbon"), value: `${format((certificated * carbon) / 1e6)} t` },
    { label: t("common.trees"), value: format(certificated * trees) },
    { label: t("common.biodiversity"), value: format(certificated * biodiversity) },
    { label: t("common.area"), value: formatArea(certificated * area, i18n.language) },
  ];

  return (
    <View className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 gap-4">
      <View className="gap-1">
        <Text className="text-gray-300 text-sm">{t("supporterProfile.totalCompensated")}</Text>
        <Text className="text-green-primary text-3xl font-bold">{format(certificated)} RC</Text>
        <Text className="text-gray-400 text-xs">{t("supporterProfile.compensationsCount", { count: compensationsCount })}</Text>
      </View>

      <View className="gap-2">
        <Text className="text-white font-semibold">{t("supporterProfile.fundingImpact")}</Text>
        <View className="flex-row flex-wrap gap-2">
          {items.map(item => (
            <View key={item.label} className="p-3 rounded-xl bg-card-secondary" style={{ width: "48.5%" }}>
              <Text className="text-white font-bold">{item.value}</Text>
              <Text className="text-gray-400 text-xs">{item.label}</Text>
            </View>
          ))}
        </View>
        <Text className="text-gray-500 text-[11px]">{t("supporterProfile.impactNote")}</Text>
      </View>
    </View>
  );
}

function CompensationRow({ compensation, currentBlock }: { compensation: Compensation; currentBlock: number }) {
  const { t } = useTranslation();
  const format = useFormat();
  const formatBlocks = useBlocksDuration();
  const { item } = useGetCalculatorItem({ itemId: compensation.calculatorItemId ?? 0 });
  const isOffset = compensation.kind === "offset";
  const when = currentBlock > compensation.blockNumber
    ? t("supporterProfile.ago", { duration: formatBlocks(currentBlock - compensation.blockNumber).split(" (")[0] })
    : "";

  return (
    <View className="p-4 rounded-xl bg-card-secondary gap-2">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-white font-semibold">
            {isOffset ? (item?.item ?? t("supporterProfile.offset")) : t("supporterProfile.treeFunding")}
          </Text>
          <Text className="text-gray-400 text-xs">{when}</Text>
        </View>
        <Text className="text-green-primary font-bold">{format(compensation.amount)} RC</Text>
      </View>
      {!!compensation.message && (
        <Text className="text-gray-200 text-sm italic">“{compensation.message}”</Text>
      )}
    </View>
  );
}

function CompensationsList({ compensations, isLoading }: { compensations: Compensation[]; isLoading: boolean }) {
  const { t } = useTranslation();
  const { blockNumber } = useBlockNumber();

  return (
    <View className="p-5 rounded-2xl bg-card-primary gap-3">
      <Text className="font-bold text-white text-xl">{t("supporterProfile.compensations")}</Text>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : compensations.length === 0 ? (
        <Text className="text-gray-400">{t("supporterProfile.noCompensations")}</Text>
      ) : (
        compensations.map(item => (
          <CompensationRow key={`${item.transactionHash}-${item.kind}`} compensation={item} currentBlock={blockNumber} />
        ))
      )}
    </View>
  );
}

function CommitmentItem({ itemId, address }: { itemId: number; address: string }) {
  const { t } = useTranslation();
  const format = useFormat();
  const { item } = useCalculatorItemById(itemId, address);

  if (!item) return null;

  return (
    <View className="bg-card-secondary p-4 rounded-xl gap-1">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-semibold flex-1">{item.item}</Text>
        <Text className="text-green-primary font-bold text-right ml-2">{format(item.tokensCompensated || 0)} RC</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-xs">{item.carbonImpact} g CO₂/{item.unit}</Text>
        <Text className="text-gray-300 text-xs">
          {t("supporterProfile.commitmentImpact", { impact: format((item.totalImpact || 0) / 1e6, 4) })}
        </Text>
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
  const { commitments } = useReductionCommitments(address);
  const { compensations, isLoading: isLoadingCompensations } = useSupporterCompensations(address);

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
        <ImpactSummary address={address} compensationsCount={compensations.length} />

        <View className="gap-2 p-5 rounded-2xl bg-card-primary">
          <Text className="font-bold text-white text-xl">{t("profile.certificates")}</Text>
          <Text className="text-gray-300 text-sm">{t("supporterProfile.certificateHint")}</Text>
          <Certificate address={address} type="supporter" />
        </View>

        <CompensationsList compensations={compensations} isLoading={isLoadingCompensations} />

        {commitments.length > 0 && (
          <View className="gap-2 p-5 rounded-2xl bg-card-primary">
            <Text className="font-bold text-white text-xl">{t('profile.declaredReductionCommitments')}</Text>
            <Text className="text-gray-300 text-sm">{t("supporterProfile.commitmentsHint")}</Text>
            {commitments.map((itemId, index) => (
              <CommitmentItem key={index} itemId={itemId} address={address} />
            ))}
          </View>
        )}

        <InvitedUsers address={address} />
        <Invitation address={address} />

        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={supporter.id} />
          <DataItem title={t("profile.registeredAt")} value={supporter.createdAt} />
        </View>
      </View>
    </View>
  )
}
