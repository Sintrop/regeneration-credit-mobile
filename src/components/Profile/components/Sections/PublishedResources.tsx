import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { usePublishedResources } from "@domain";
import { AppStackParamsList } from "@routes";

import { ResourceCard } from "../../../../screens/ResourcesListScreen/components/ResourceCard";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "UserDetailsScreen">;

/** Valid researches, reports or contributions published by this address. */
export function PublishedResources({ address }: { address: string }) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { resources, isLoading } = usePublishedResources();
  const mine = resources.filter(resource => resource.author.toLowerCase() === address.toLowerCase());

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-1">
        <Text className="font-bold text-white text-xl">{t("profile.publishedResources")}</Text>
        {!isLoading && <Text className="text-gray-400">{mine.length}</Text>}
      </View>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : mine.length === 0 ? (
        <View className="p-5 rounded-2xl bg-card-primary">
          <Text className="text-gray-400">{t("profile.noPublishedResources")}</Text>
        </View>
      ) : (
        mine.map(resource => (
          <ResourceCard
            key={`${resource.type}-${resource.id}`}
            resource={resource}
            onPress={item => navigation.push("ResourceScreen", { id: item.id, resourceType: item.type })}
            onPressAuthor={() => {}}
            hideAuthor
          />
        ))
      )}
    </View>
  );
}
