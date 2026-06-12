import { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CAT_IMAGES_BY_COLOR, CatState } from '@/constants/cats';
import { useSettingsStore } from '@/stores/settingsStore';

interface Props {
  state: CatState;
}

export function CatDisplay({ state }: Props) {
  const { catColor } = useSettingsStore();
  const translateY = useSharedValue(0);
  const rotate    = useSharedValue(0);
  const scale     = useSharedValue(1);
  const opacity   = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(translateY);
    cancelAnimation(rotate);
    cancelAnimation(scale);
    cancelAnimation(opacity);
    translateY.value = 0;
    rotate.value     = 0;
    scale.value      = 1;
    opacity.value    = 1;

    switch (state) {
      case 'idle':
      case 'focusing':
      case 'sleep':
        // float: ふわふわ上下（3秒ループ）
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
            withTiming(0,  { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false
        );
        break;

      case 'break':
        // pulse: ゆっくり拡大縮小（2.2秒ループ）
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
            withTiming(1,    { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false
        );
        break;

      case 'stare':
        // wiggle: 左右に揺れる（0.45秒ループ）
        rotate.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 112, easing: Easing.inOut(Easing.quad) }),
            withTiming(5,  { duration: 225, easing: Easing.inOut(Easing.quad) }),
            withTiming(0,  { duration: 112, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
          false
        );
        break;

      case 'happy':
        // pop（0.45秒）→ float
        opacity.value = withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(1,   { duration: 450 }),
        );
        scale.value = withSequence(
          withTiming(0.7, { duration: 0 }),
          withTiming(1, { duration: 450, easing: Easing.out(Easing.back(1.5)) }),
        );
        translateY.value = withSequence(
          withTiming(0, { duration: 450 }),
          withRepeat(
            withSequence(
              withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
              withTiming(0,  { duration: 1500, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false
          )
        );
        break;
    }

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [state, translateY, rotate, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={CAT_IMAGES_BY_COLOR[catColor][state]} style={styles.cat} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  cat: { width: 155, height: 155 },
});
