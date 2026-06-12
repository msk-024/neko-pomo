import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { formatSeconds } from '@/utils/time';
import type { TimerMode } from '@/stores/timerStore';

interface Props {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
}

const SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODE_LABELS: Record<TimerMode, string> = {
  focus:     '集中',
  break:     '休憩',
  longBreak: '長休憩',
};

// 集中のみグラデーション、休憩/長休憩はモード色ベタ塗り
const MODE_SOLID_COLOR: Partial<Record<TimerMode, string>> = {
  break:     Colors.green,
  longBreak: Colors.yellow,
};

export function CircleTimer({ secondsLeft, totalSeconds, mode }: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const ringStroke = MODE_SOLID_COLOR[mode] ?? 'url(#focusGrad)';

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Defs>
          <LinearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Colors.pink} />
            <Stop offset="1" stopColor={Colors.pinkSoft} />
          </LinearGradient>
        </Defs>
        {/* バックグラウンドトラック */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={Colors.peach}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* プログレスアーク */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={ringStroke}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.inner}>
        <Text style={styles.modeLabel}>{MODE_LABELS[mode]}</Text>
        <Text style={styles.time}>{formatSeconds(secondsLeft)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeLabel: {
    fontSize: 16,
    color: Colors.brownMid,
    fontWeight: '600',
  },
  time: {
    fontSize: 40,
    color: Colors.brown,
    fontWeight: '700',
  },
});
