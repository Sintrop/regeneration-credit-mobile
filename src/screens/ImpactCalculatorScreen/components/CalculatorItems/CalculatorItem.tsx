import { TouchableOpacity, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";

import { Offset, Text } from "@components";
import { CalculatorItemProps } from "@domain";
import { useUserContext } from "@hooks";
import { useDeclareReductionCommitment } from "@domain";

interface Props {
  item: CalculatorItemProps;
}

export function CalculatorItem({ item }: Props) {
  const { userType } = useUserContext();
  const { declareReductionCommitment } = useDeclareReductionCommitment();
  const { t } = useTranslation();

  const handleCommit = () => {
    Alert.alert(
      t('impactCalculator.declareCommitment'),
      t('impactCalculator.declareCommitmentQuestion', { item: item.item }),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('impactCalculator.declare'),
          onPress: () => declareReductionCommitment(item.id)
        }
      ]
    );
  };

  return (
    <View className="flex-row items-center justify-between h-12 px-3 border-b border-card-secondary">
      <Text className="text-white">{item.item}</Text>

      {userType === 7 && (
        <View className="flex-row gap-2">
          <Offset item={item}>
            <OffsetButton label="Offset" />
          </Offset>
          
          <TouchableOpacity 
            onPress={handleCommit}
            className="px-3 h-8 rounded-2xl bg-blue-primary items-center justify-center"
            hitSlop={5}
          >
            <Text className="text-white font-semibold text-xs">{t('impactCalculator.commitment')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

interface OffsetButtonProps {
  openModal?: () => void;
  label: string;
}
function OffsetButton({ openModal, label }: OffsetButtonProps) {
  return (
    <TouchableOpacity 
      onPress={openModal}
      className="px-3 h-8 rounded-2xl bg-green-primary items-center justify-center"
      hitSlop={5}
    >
      <Text className="text-white font-semibold text-xs">{label}</Text>
    </TouchableOpacity>
  )
}