import { View, FlatList, ListRenderItemInfo, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { useUserContext } from "@hooks";
import { TxProps, useCommissions, useTransfers } from "@domain";

import { Balance } from "./components/Balance";
import { TxItem } from "./components/TxItem";
import { useState } from "react";
import { SelectorTab, Tabs } from "./components/Tabs";
import { LoadingTx } from "./components/LoadingTx";
import { TransferModal } from "./components/TransferModal";

export function MyTokensScreen() {
  const { t } = useTranslation();
  const { address, isConnected, handleConnect } = useUserContext();
  const { txs, isLoading: isLoadingTxs, refetch, isRefetching } = useTransfers({ address });
  const { commissions, isLoading: isLoadingCommissions } = useCommissions({ address });

  const [selectedTab, setSelectedTab] = useState<Tabs>('txs');
  const [showTransferModal, setShowTransferModal] = useState(false);

  function renderTxItem({ item }: ListRenderItemInfo<TxProps>) {
    return (
      <TxItem tx={item} />
    )
  }

  if (!isConnected) {
    return (
      <Screen title={t('myTokens.title')} showBackButton>
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-white text-center">{t('myTokens.connectToSee')}</Text>
          <TouchableOpacity className="h-12 px-8 rounded-2xl items-center justify-center bg-green-primary" onPress={handleConnect}>
            <Text className="text-green-secondary font-bold">{t('common.connect')}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={t('myTokens.title')} showBackButton>
      <FlatList
        data={selectedTab === 'txs' ? txs : commissions}
        keyExtractor={(item, index) => `${item.hash}-${index}`}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={renderTxItem}
        ListHeaderComponent={<HeaderList selectedTab={selectedTab} changeTab={setSelectedTab} onTransfer={() => setShowTransferModal(true)} />}
        ListEmptyComponent={<EmptyList selectedTab={selectedTab} isLoading={selectedTab === 'txs' ? isLoadingTxs : isLoadingCommissions} />}
        contentContainerClassName="p-5"
      />
      <TransferModal visible={showTransferModal} onClose={() => setShowTransferModal(false)} />
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
function HeaderList({ changeTab, selectedTab, onTransfer }: HeaderListProps & { onTransfer?: () => void }) {
  const { t } = useTranslation();

  return (
    <View className="gap-5">
      <Balance onTransfer={onTransfer} />
      <SelectorTab selectedTab={selectedTab} changeTab={changeTab} />

      {selectedTab === 'txs' && (
        <Text className="text-gray-400 text-xs text-center">{t('myTokens.onlyRcTxsWillBeShowHere')}</Text>
      )}
    </View>
  )
}
