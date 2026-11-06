import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Screen, Text } from "@components";
import {
  useCurrentEra,
  useImpactEras,
  useImpactPerToken,
  useImpactSettlement,
  useTokenData,
  useTotalImpact,
} from "@domain";
import {
  CARBON_PER_TREE_GRAMS,
  averageTreesPerInspection,
  eraImpactStatus,
  formatArea,
  formatCarbon,
  tokenSupplyBreakdown,
} from "@utils";

import { TokenPerTree } from "../ImpactCalculatorScreen/components/TokenPerTree/TokenPerTree";

function useFormat() {
  const { i18n } = useTranslation();
  return (value: number, digits = 0) =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value || 0);
}

function Tile({ value, label, isLoading, width = "48.5%" }: { value: string; label: string; isLoading?: boolean; width?: `${number}%` }) {
  return (
    <View className="p-3 rounded-xl bg-card-secondary" style={{ width }}>
      {isLoading ? <ActivityIndicator color="white" className="self-start" /> : (
        <Text className="text-white text-lg font-bold" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      )}
      <Text className="text-gray-400 text-xs">{label}</Text>
    </View>
  );
}

function Card({ title, description, children, highlight }: { title: string; description?: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <View className={`p-5 rounded-2xl bg-card-primary gap-3 ${highlight ? "border border-green-primary/40" : ""}`}>
      <View className="gap-1">
        <Text className="text-white font-bold text-lg">{title}</Text>
        {!!description && <Text className="text-gray-300 text-sm">{description}</Text>}
      </View>
      {children}
    </View>
  );
}

/** RegenerationCreditImpact totals: trees, carbon, species and area of the whole system. */
function SystemImpact() {
  const { t, i18n } = useTranslation();
  const format = useFormat();
  const { carbon, trees, biodiversity, area, isLoading } = useTotalImpact();

  return (
    <View className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 gap-4">
      <View className="gap-1">
        <Text className="text-gray-300 text-sm">{t("tokenImpact.systemImpact")}</Text>
        {isLoading ? <ActivityIndicator color="white" className="self-start" /> : (
          <Text className="text-green-primary text-4xl font-bold">{formatCarbon(carbon, i18n.language)}</Text>
        )}
        <Text className="text-gray-300 text-sm">{t("tokenImpact.carbonSequestered")}</Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-y-2">
        <Tile width="32%" value={format(trees)} label={t("common.trees")} isLoading={isLoading} />
        <Tile width="32%" value={format(biodiversity)} label={t("tokenImpact.species")} isLoading={isLoading} />
        <Tile width="32%" value={formatArea(area, i18n.language)} label={t("common.area")} isLoading={isLoading} />
      </View>
      <Text className="text-gray-500 text-[11px]">{t("tokenImpact.systemImpactNote")}</Text>
    </View>
  );
}

function ImpactPerRc() {
  const { t, i18n } = useTranslation();
  const significant = (value: number) => Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 4 }).format(value || 0);
  const { carbon, trees, biodiversity, area, isLoading } = useImpactPerToken();

  return (
    <Card title={t("tokenImpact.impactPerToken")} description={t("tokenImpact.impactPerTokenDescription")}>
      <View className="flex-row flex-wrap justify-between gap-y-2">
        <Tile value={formatCarbon(carbon, i18n.language)} label={t("common.carbon")} isLoading={isLoading} />
        <Tile value={significant(trees)} label={t("common.trees")} isLoading={isLoading} />
        <Tile value={significant(biodiversity)} label={t("tokenImpact.species")} isLoading={isLoading} />
        <Tile value={formatArea(area, i18n.language)} label={t("common.area")} isLoading={isLoading} />
      </View>
    </Card>
  );
}

function Step({ index, title, value }: { index: number; title: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-6 h-6 rounded-full bg-green-primary/20 items-center justify-center">
        <Text className="text-green-primary text-xs font-bold">{index}</Text>
      </View>
      <Text className="flex-1 text-gray-200 text-sm">{title}</Text>
      <Text className="text-white font-semibold">{value}</Text>
    </View>
  );
}

/** Walks through RegenerationCreditImpact.totalTreesImpact and the per-token division with live numbers. */
function HowItIsCalculated() {
  const { t, i18n } = useTranslation();
  const format = useFormat();
  const { settlement, isLoading } = useImpactSettlement();
  const { trees, carbon } = useTotalImpact();
  const { totalSupply, totalLocked, totalCertified } = useTokenData();
  const { effective } = tokenSupplyBreakdown(totalSupply, totalLocked, totalCertified);

  if (isLoading || !settlement) {
    return <Card title={t("tokenImpact.howTitle")}><ActivityIndicator color="white" /></Card>;
  }

  const average = averageTreesPerInspection(settlement.inspectionsTrees, settlement.realizedInspections);

  return (
    <Card title={t("tokenImpact.howTitle")} description={t("tokenImpact.howDescription")}>
      <View className="gap-3">
        <Step index={1} title={t("tokenImpact.howAverage", { count: settlement.realizedInspections })} value={format(average, 1)} />
        <Step index={2} title={t("tokenImpact.howRegenerators")} value={`× ${format(settlement.certifiedRegenerators)}`} />
        <Step index={3} title={t("tokenImpact.howTrees")} value={format(trees)} />
        <Step index={4} title={t("tokenImpact.howCarbon", { kg: CARBON_PER_TREE_GRAMS / 1000 })} value={formatCarbon(carbon, i18n.language)} />
        <Step index={5} title={t("tokenImpact.howPerToken")} value={`÷ ${format(effective)} RC`} />
      </View>
      <Text className="text-gray-500 text-[11px]">{t("tokenImpact.howNote")}</Text>
    </Card>
  );
}

function SupplyRow({ color, label, value, percent }: { color: string; label: string; value: string; percent: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <Text className="flex-1 text-gray-200 text-sm">{label}</Text>
      <Text className="text-white font-semibold">{value}</Text>
      <Text className="text-gray-400 text-xs w-12 text-right">{percent}</Text>
    </View>
  );
}

/** RegenerationCredit supply split: still in the pools, circulating, and burned for certificates. */
function TokenSupply() {
  const { t, i18n } = useTranslation();
  const format = useFormat();
  const percent = (value: number, total: number) =>
    Intl.NumberFormat(i18n.language, { style: "percent", maximumFractionDigits: 1 }).format(total > 0 ? value / total : 0);
  const { totalSupply, totalLocked, totalCertified, isLoading } = useTokenData();
  const { circulating, effective } = tokenSupplyBreakdown(totalSupply, totalLocked, totalCertified);
  const issued = totalSupply + totalCertified;

  return (
    <Card title={t("tokenImpact.tokenData")} description={t("tokenImpact.tokenDataDescription")}>
      {isLoading ? <ActivityIndicator color="white" /> : (
        <>
          <View className="h-3 rounded-full overflow-hidden flex-row bg-card-secondary">
            <View className="bg-gray-500" style={{ flex: totalLocked }} />
            <View className="bg-green-primary" style={{ flex: circulating }} />
            <View className="bg-amber-400" style={{ flex: totalCertified, minWidth: totalCertified > 0 ? 3 : 0 }} />
          </View>
          <View className="gap-2">
            <SupplyRow color="bg-gray-500" label={t("tokenImpact.inPools")} value={`${format(totalLocked)} RC`} percent={percent(totalLocked, issued)} />
            <SupplyRow color="bg-green-primary" label={t("tokenImpact.circulatingSupply")} value={`${format(circulating)} RC`} percent={percent(circulating, issued)} />
            <SupplyRow color="bg-amber-400" label={t("tokenImpact.totalCertified")} value={`${format(totalCertified)} RC`} percent={percent(totalCertified, issued)} />
          </View>
          <View className="pt-3 border-t border-card-secondary gap-1">
            <View className="flex-row justify-between">
              <Text className="text-gray-300 text-sm">{t("tokenImpact.totalSupply")}</Text>
              <Text className="text-white font-semibold">{format(totalSupply)} RC</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-300 text-sm">{t("tokenImpact.effectiveSupply")}</Text>
              <Text className="text-white font-semibold">{format(effective)} RC</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

const STATUS_STYLE = {
  settled: "bg-green-primary/20 text-green-primary",
  pending: "bg-amber-400/20 text-amber-300",
  current: "bg-blue-primary/20 text-blue-primary",
};

/** InspectionRules.impactPerEra, with whether each era is already in the system totals. */
function ImpactByEra() {
  const { t } = useTranslation();
  const format = useFormat();
  const { data: eraData } = useCurrentEra();
  const currentEra = eraData.currentEra;
  const { settlement } = useImpactSettlement();
  const { eras, isLoading } = useImpactEras(currentEra);
  const [selected, setSelected] = useState<number | null>(null);

  const chosen = eras.find(item => item.era === (selected ?? eras.find(e => e.totalInspections > 0)?.era ?? currentEra));
  const status = chosen && settlement ? eraImpactStatus(chosen.era, currentEra, settlement.lastSettledEra) : null;

  return (
    <Card title={t("tokenImpact.totalImpactPerEra")} description={t("tokenImpact.perEraDescription")}>
      {isLoading || !chosen ? <ActivityIndicator color="white" /> : (
        <>
          <View className="flex-row flex-wrap gap-2">
            {eras.map(item => {
              const active = item.era === chosen.era;
              return (
                <TouchableOpacity
                  key={item.era}
                  className={`h-9 px-4 rounded-full items-center justify-center ${active ? "bg-green-primary" : "bg-card-secondary"}`}
                  onPress={() => setSelected(item.era)}
                >
                  <Text className={`text-sm font-semibold ${active ? "text-green-secondary" : "text-white"}`}>
                    {t("tokenImpact.era", { era: item.era })}{item.era === currentEra ? ` · ${t("tokenImpact.current")}` : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {status && (
            <Text className={`self-start text-xs font-semibold px-3 py-1 rounded-full overflow-hidden ${STATUS_STYLE[status]}`}>
              {t(`tokenImpact.status.${status}`)}
            </Text>
          )}
          <View className="flex-row flex-wrap justify-between gap-y-2">
            <Tile value={format(chosen.totalInspections)} label={t("common.inspections")} />
            <Tile value={format(chosen.totalTress)} label={t("tokenImpact.treesCounted")} />
            <Tile value={format(chosen.totalBiodiversity)} label={t("tokenImpact.speciesCounted")} />
            <Tile value={format(averageTreesPerInspection(chosen.totalTress, chosen.totalInspections), 1)} label={t("tokenImpact.treesPerInspection")} />
          </View>
          {status && <Text className="text-gray-500 text-[11px]">{t(`tokenImpact.statusNote.${status}`)}</Text>}
        </>
      )}
    </Card>
  );
}

export function TokenImpactScreen() {
  const { t } = useTranslation();

  return (
    <Screen title={t('tokenImpact.title')} showBackButton scrollable>
      <View className="gap-4 mb-10">
        <SystemImpact />
        <TokenPerTree />
        <ImpactPerRc />
        <HowItIsCalculated />
        <TokenSupply />
        <ImpactByEra />
        <View className="flex-row items-center justify-center gap-2 opacity-70">
          <Icon name="rc" size={16} />
          <Text className="text-gray-400 text-xs">{t("tokenImpact.source")}</Text>
        </View>
      </View>
    </Screen>
  )
}
