import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BG_IMAGES, BgType } from '@/constants/backgrounds';
import { Colors } from '@/constants/colors';
import { CAT_MESSAGES } from '@/constants/cats';
import { useBackground } from '@/hooks/useBackground';
import { useCatState } from '@/hooks/useCatState';
import { useSettingsStore } from '@/stores/settingsStore';
import { CatDisplay } from './CatDisplay';
import { CatBubble } from './CatBubble';

const FADE_DURATION = 1500;

/**
 * 全タブ共通の上部エリア。背景画像はこのエリアのみに適用される。
 * ImageBackground ではなく Image + absoluteFill を使うことで、
 * react-native-web での object-fit:cover / object-position:center が正確に機能する。
 */
export function CatHeader() {
  const { height } = useWindowDimensions();
  const catState = useCatState();
  const bgType = useBackground();
  const { catName } = useSettingsStore();

  const [bottomBg, setBottomBg] = useState<BgType>(bgType);
  const topOpacity = useSharedValue(1);

  useEffect(() => {
    topOpacity.value = 0;
    topOpacity.value = withTiming(1, { duration: FADE_DURATION });
    // フェード完了後に下層を更新（runOnJS不要のタイマー方式）
    const t = setTimeout(() => setBottomBg(bgType), FADE_DURATION);
    return () => clearTimeout(t);
  }, [bgType, topOpacity]);

  const topStyle = useAnimatedStyle(() => ({ opacity: topOpacity.value }));

  return (
    <View style={[styles.container, { height: Math.max(height * 0.38, 250) }]}>
      {/* 背景だけをクリップ。画像ロード前は暖色で表示される */}
      <View style={styles.bgClip}>
        <Image
          source={BG_IMAGES[bottomBg]}
          style={styles.bgImage}
          resizeMode="cover"
        />
        <Animated.Image
          source={BG_IMAGES[bgType]}
          style={[styles.bgImage, topStyle]}
          resizeMode="cover"
        />
      </View>

      {/* 猫コンテンツ（クリップされない） */}
      <View style={styles.content}>
        {/* 名前バッジ：上部に固定 */}
        <View style={styles.nameBadge}>
          <Text style={styles.nameBadgeText}>🐱 {catName}</Text>
        </View>
        {/* 猫＋吹き出しをひとまとめにして中央寄せ → 吹き出しが猫の直下に来る */}
        <View style={styles.catGroup}>
          <CatDisplay state={catState} />
          <CatBubble message={CAT_MESSAGES[catState]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // overflow: 'hidden' なし → 吹き出しがはみ出せる
  },
  bgClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#D4B896', // 画像ロード前のフォールバック色
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
  },
  catGroup: {
    alignItems: 'center',
    gap: 6,
  },
  nameBadge: {
    backgroundColor: Colors.peach,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  nameBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brown,
  },
});
