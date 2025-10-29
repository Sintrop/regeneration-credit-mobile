import { View, FlatList, ListRenderItemInfo } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { useUserContext } from "@hooks";
import { TxProps, useCommissions, useTransfers } from "@domain";

import { Balance } from "./components/Balance";
import { TxItem } from "./components/TxItem";
import { useState } from "react";
import { SelectorTab, Tabs } from "./components/Tabs";
import { LoadingTx } from "./components/LoadingTx";

export function MyTokensScreen() {
  const { t } = useTranslation();
  const { address } = useUserContext();
  const { txs, isLoading: isLoadingTxs } = useTransfers({ address });
  const { commissions, isLoading: isLoadingCommissions } = useCommissions({ address });

  const [selectedTab, setSelectedTab] = useState<Tabs>('txs');

  function renderTxItem({ item }: ListRenderItemInfo<TxProps>) {
    return (
      <TxItem tx={item} />
    )
  }

  return (
    <Screen title={t('myTokens.title')} showBackButton>
      <FlatList
        data={selectedTab === 'txs' ? txs : commissions}
        keyExtractor={item => item.hash}
        renderItem={renderTxItem}
        ListHeaderComponent={<HeaderList selectedTab={selectedTab} changeTab={setSelectedTab} />}
        ListEmptyComponent={<EmptyList selectedTab={selectedTab} isLoading={selectedTab === 'txs' ? isLoadingTxs : isLoadingCommissions} />}
        contentContainerClassName="p-5"
      /> 
    </Screen>
  );
}

function EmptyList({ selectedTab, isLoading }: { selectedTab: Tabs; isLoading?: boolean }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View className="gap-5">
        <LoadingTx />
        <LoadingTx />
        <LoadingTx />
        <LoadingTx />
        <LoadingTx />
        <LoadingTx />
        <LoadingTx />
      </View>
    )
  }

  return (
    <Text className="text-white mt-10 text-center">
      {selectedTab === 'txs' ? t('myTokens.noTxs') : t('myTokens.noReceivedCommissions')}
    </Text>
  )
}

interface HeaderListProps {
  selectedTab: Tabs;
  changeTab: (tab: Tabs) => void;
}
function HeaderList({ changeTab, selectedTab }: HeaderListProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-5">
      <Balance />
      <SelectorTab selectedTab={selectedTab} changeTab={changeTab} />

      {selectedTab === 'txs' && (
        <Text className="text-white text-center mb-2">{t('myTokens.onlyRcTxsWillBeShowHere')}</Text>
      )}
    </View>
  )
}
