import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Avatar, Text } from "@components";
import { 
  activistService, 
  contributorService, 
  developerService, 
  inspectorService, 
  regeneratorService, 
  researcherService, 
  supporterService, 
  useUserBasicData
} from "@domain";
import { useSettingsContext } from "@hooks";

import { LoadingUserItem } from "./LoadingUserItem";

interface Props {
  id: number;
  userType: number;
  handleGoToUserDetail: (address: string) => void;
}

export function UserItem({ id , userType, handleGoToUserDetail }: Props) {
  const { rpc } = useSettingsContext();
  const [address, setAddress] = useState<string>('');

  const { user, isLoading } = useUserBasicData({ address, userType });

  useEffect(() => {
    getAddress();
  }, [id]);

  async function getAddress() {
    if (userType === 1) {
      const addressResponse = await regeneratorService.getRegeneratorAddress({ rpc, id });
      setAddress(addressResponse);
    }

    if (userType === 2) {
      const addressInspector = await inspectorService.getInspectorAddress({ rpc, id });
      setAddress(addressInspector);
    }

    if (userType === 3) {
      const researcherAddress = await researcherService.getResearchAddress({ rpc, id });
      setAddress(researcherAddress);
    }

    if (userType === 4) {
      const developerAddress = await developerService.getDeveloperAddress({ rpc, id });
      setAddress(developerAddress);
    }

    if (userType === 5) {
      const contributorAddress = await contributorService.getContributorAddress({ rpc, id });
      setAddress(contributorAddress);
    }

    if (userType === 6) {
      const activistAddress = await activistService.getActivistAddress({ rpc, id });
      setAddress(activistAddress)
    }

    if (userType === 7) {
      const supporterAddress = await supporterService.getSupporterAddress({ rpc, id });
      setAddress(supporterAddress);
    }
  }

  if (isLoading || address === '') {
    return (
      <View className="w-full p-3 bg-card-primary rounded-2xl flex-row gap-3 h-[96]">
        <LoadingUserItem />
      </View>
    )
  }

  return (
    <TouchableOpacity 
      className="w-full p-3 bg-card-primary rounded-2xl flex-row items-center gap-3 h-[96]"
      onPress={() => handleGoToUserDetail(address)}
      disabled={isLoading || address === ''}
    >
      <View className="w-20 h-20">
        <Avatar
          address={address}
          photoHash={user?.photo}
          size={70}
        />
      </View>
      <View className="gap-1 max-w-[75%]">
        <Text className="font-bold text-white">{user?.name}</Text>
        <Text className="text-white text-sm" numberOfLines={1}>{address}</Text>
      </View>
    </TouchableOpacity>
  )
}