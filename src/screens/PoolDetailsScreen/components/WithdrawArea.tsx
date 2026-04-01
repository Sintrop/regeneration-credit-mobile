import { TouchableOpacity, View } from "react-native";

import { useUserContext } from "@hooks";
import { Text } from "@components";
import { useUserBasicData, useWithdraw } from "@domain";

interface Props {
  poolType: number;
  poolEra: number;
}

export function WithdrawArea({ poolType, poolEra }: Props) {
  const { userType, address } = useUserContext();
  const { withdraw } = useWithdraw();
  const { user } = useUserBasicData({ address, userType });
  const canWithdraw = (user?.poolLevel ?? 0) < poolEra;
  
  if (userType !== poolType) return <></>;

  function handleWithdraw() {
    if (!userType || userType === 0) return;
    withdraw({
      userType
    })
  }
  
  return (
    <View className="w-full p-3 rounded-2xl bg-card-primary mt-5">
      <Text className="text-white">Próxima fase</Text>
      <Text className="text-gray-400 text-justify">
        Quando o botão estiver habilitado, você pode avançar de fase e se tiver direito vai receber seus Créditos de Regeneração como recompensa dos serviços prestados na fase anterior.
      </Text>
      <View className="w-full flex-row items-center justify-between mt-3">
        <View className="flex-row gap-2">
          <View className="items-center justify-center p-3 rounded-md bg-card-secondary min-w-24">
            <Text className="font-bold text-white text-xl">{user?.poolLevel}</Text>
            <Text className="text-xs text-gray-300">Seu nível</Text>
          </View>
          <View className="items-center justify-center p-3 rounded-md bg-card-secondary min-w-24">
            <Text className="font-bold text-white text-xl">{poolEra}</Text>
            <Text className="text-xs text-gray-300">Nível Max.</Text>
          </View>
        </View>

        <TouchableOpacity
          className="px-5 py-2 rounded-xl bg-blue-primary items-center justify-center max-w-[40%] disabled:opacity-50"
          onPress={handleWithdraw}
          disabled={!canWithdraw}
        >
          <Text className="text-white text-sm text-center">Avançar para próxima fase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
