import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, IconsName, Text } from "@components";
import { useUserContext } from "@hooks";

export type Tabs = 'txs' | 'commissions';

interface Props {
  selectedTab: Tabs;
  changeTab: (tab: Tabs) => void;
}
export function SelectorTab({ changeTab, selectedTab }: Props) {
  const { t } = useTranslation();
  const { userType } = useUserContext();

  return (
    <View className="flex-row items-center gap-5">
      <Tab 
        isSelected={selectedTab === 'txs'}
        onPress={() => changeTab('txs')}
        label={t('myTokens.txs')}
        icon="tokens"
      />

      {userType === 7 && (
        <Tab 
          isSelected={selectedTab === 'commissions'}
          onPress={() => changeTab('commissions')}
          label={t('myTokens.commissions')}
          icon="rc"
        />
      )}
    </View>
  )
}

interface TabProps {
  label: string;
  isSelected: boolean;
  icon: IconsName;
  onPress: () => void;
}
function Tab({ isSelected, label, icon, onPress}: TabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-5 h-12 flex-row gap-2 items-center justify-center border-b-2 ${isSelected ? 'border-green-500' : 'border-transparent'}`}
    >
      <Icon name={icon} />
      <Text className={`font-semibold ${isSelected ? 'text-green-500' : 'text-white'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}
