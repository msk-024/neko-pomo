import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { formatSeconds } from '@/utils/time';
import type { TimerMode } from '@/stores/timerStore';

interface Props {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
}

const SIZE = 220;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODE_LABELS: Record<TimerMode, string> = {
  focus:     '集中',
  break:     '休憩',
  longBreak: '長休憩',
};

const MODE_SOLID_COLOR: Partial<Record<TimerMode, string>> = {
  break:     Colors.green,
  longBreak: Colors.yellow,
};

export function CircleTimer({ secondsLeft, totalSeconds, mode, isRunning, onStart, onPause }: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const ringStroke = MODE_SOLID_COLOR[mode] ?? 'url(#focusGrad)';
  const actionColor = MODE_SOLID_COLOR[mode] ?? Colors.pink;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Defs>
          <LinearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Colors.pink} />
            <Stop offset="1" stopColor={Colors.pinkSoft} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke={Colors.peach} strokeWidth={STROKE_WIDTH} fill="none"
        />
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke={ringStroke} strokeWidth={STROKE_WIDTH} fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.inner}>
        <Text style={styles.modeLabel}>{MODE_LABELS[mode]}</Text>
        <Text style={styles.time}>{formatSeconds(secondsLeft)}</Text>
        {/* スタート/一時停止ボタンを円の中に配置 */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isRunning ? Colors.brownMid : actionColor }]}
          onPress={isRunning ? onPause : onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {isRunning ? '⏸ 停止' : '▶ スタート'}
          </Text>
        </TouchableOpacity>
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
    gap: 4,
  },
  modeLabel: {
    fontSize: 15,
    color: Colors.brownMid,
    fontWeight: '600',
  },
  time: {
    fontSize: 38,
    color: Colors.brown,
    fontWeight: '700',
    lineHeight: 44,
  },
  actionButton: {
    marginTop: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
