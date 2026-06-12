import { useState, useEffect, useCallback } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BG_IMAGES, BgType } from '@/constants/backgrounds';
import { useBackground } from '@/hooks/useBackground';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Background({ children }: Props) {
  const bgType = useBackground();
  const [bottomBg, setBottomBg] = useState<BgType>(bgType);
  const topOpacity = useSharedValue(1);

  const updateBottom = useCallback((bg: BgType) => setBottomBg(bg), []);

  useEffect(() => {
    // 新しい背景を透明から不透明へフェードイン（1.5秒）
    // 完了後に底レイアウトを静かに差し替えて次の遷移に備える
    topOpacity.value = 0;
    topOpacity.value = withTiming(1, { duration: 1500 }, (finished) => {
      if (finished) runOnJS(updateBottom)(bgType);
    });
  }, [bgType, topOpacity, updateBottom]);

  const topStyle = useAnimatedStyle(() => ({
    opacity: topOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* 下層：前の背景（常に不透明） */}
      <ImageBackground
        source={BG_IMAGES[bottomBg]}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* 上層：新しい背景（フェードイン） */}
      <Animated.View style={[StyleSheet.absoluteFill, topStyle]}>
        <ImageBackground
          source={BG_IMAGES[bgType]}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </Animated.View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
