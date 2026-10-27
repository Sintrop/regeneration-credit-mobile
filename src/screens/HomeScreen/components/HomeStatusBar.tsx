import { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useCurrentEra } from '@domain';

function MarqueeText({ text }: { text: string }) {
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (textWidth > 0 && containerWidth > 0) {
      translateX.value = containerWidth;
      translateX.value = withRepeat(
        withTiming(-textWidth, {
          duration: (textWidth + containerWidth) * 20, // Ajuste a velocidade aqui
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [textWidth, containerWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="flex-1 overflow-hidden flex-row items-center h-full"
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        style={[animatedStyle, { color: '#fff', fontSize: 13, fontWeight: 'bold' }]}
        onLayout={(e: LayoutChangeEvent) => setTextWidth(e.nativeEvent.layout.width)}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

export function HomeStatusBar() {
  const { t } = useTranslation();
  const { data, isLoading } = useCurrentEra();

  const { currentEra = 0, nextEraIn = 0 } = data || {};

  if (isLoading) {
    return (
      <View className="bg-green-primary/10 -mx-3 mb-4 h-8 flex-row items-center justify-center">
        <Animated.Text style={{ color: '#fff', fontSize: 12 }}>{t('homeScreen.loadingEraInfo')}</Animated.Text>
      </View>
    );
  }

  const tickerText = t('homeScreen.currentEraTicker', {
    era: currentEra,
    blocks: Intl.NumberFormat('pt-BR').format(nextEraIn),
  });

  return (
    <View className="bg-green-primary/10 -mx-3 mb-4 h-8 flex-row items-center border-y border-green-primary/20">
      <MarqueeText text={tickerText} />
    </View>
  );
}
