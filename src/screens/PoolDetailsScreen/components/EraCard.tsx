import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { usePoolEra } from "@domain";

interface EraCardProps {
  userType: number;
  currentEra: number;
}

// Helper to format tokens from wei to whole number with dot for thousands
function formatTokens(value?: number): string {
  if (!value) return '0';
  // Convert from wei (divide by 1e18) and round to whole number
  const tokens = Math.round(value / 1e18);
  // Format with dot for thousands
  return tokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function EraCard({ userType, currentEra }: EraCardProps) {
  const { t } = useTranslation();
  const [selectedEra, setSelectedEra] = useState(currentEra > 0 ? currentEra : 1);

  const { data, isLoading } = usePoolEra({ userType, eraId: selectedEra });

  useEffect(() => {
    if (currentEra > 0) {
      setSelectedEra(currentEra);
    }
  }, [currentEra]);

  const eras = Array.from({ length: currentEra }, (_, i) => i + 1);

  return (
    <View className="w-full gap-3 mt-4">
      <Text preset="bold" className="text-white text-lg font-bold">
        {t('poolsDetailsScreen.eraData')}
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-2"
        contentContainerStyle={{ gap: 8 }}
      >
        {eras.map((era) => (
          <TouchableOpacity
            key={era}
            onPress={() => setSelectedEra(era)}
            className={`px-4 py-2 rounded-xl border ${
              selectedEra === era 
                ? 'bg-blue-primary border-blue-primary' 
                : 'bg-card-secondary border-gray-600'
            }`}
          >
            <Text className={`font-bold ${selectedEra === era ? 'text-white' : 'text-gray-400'}`}>
              Fase {era}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="w-full p-5 rounded-2xl bg-card-primary gap-4">
        {isLoading ? (
          <ActivityIndicator color="#75d63a" />
        ) : (
          <>
            <View className="flex-row justify-between items-center">
               <EraDataItem 
                label={t('poolsDetailsScreen.claimsCount')} 
                value={data?.claimsCount ?? 0} 
              />
              <EraDataItem 
                label={t('poolsDetailsScreen.levels')} 
                value={data?.levels ?? 0} 
              />
            </View>
            <View className="h-[1px] bg-gray-700 w-full" />
            <EraDataItem 
              label={t('poolsDetailsScreen.tokens')} 
              value={formatTokens(data?.tokens)} 
              suffix="RC"
            />
          </>
        )}
      </View>
    </View>
  );
}

interface EraDataItemProps {
  label: string;
  value: string | number;
  suffix?: string;
}

function EraDataItem({ label, value, suffix }: EraDataItemProps) {
  return (
    <View className="gap-1">
      <Text className="text-gray-400 text-xs uppercase font-bold">{label}</Text>
      <Text className="text-white text-xl font-bold">
        {value} {suffix && <Text className="text-xs text-primary">{suffix}</Text>}
      </Text>
    </View>
  );
}
