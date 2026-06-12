import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import type { TimerMode } from '@/stores/timerStore';

interface Props {
  mode: TimerMode;
  onChangeMode: (mode: TimerMode) => void;
}

const MODES: { key: TimerMode; label: string; emoji: string; activeColor: string }[] = [
  { key: 'focus',     label: '集中',  emoji: '🍅', activeColor: Colors.pink },
  { key: 'break',     label: '休憩',  emoji: '🫐', activeColor: Colors.green },
  { key: 'longBreak', label: '長休憩', emoji: '🌿', activeColor: Colors.green },
];

export function ModeTab({ mode, onChangeMode }: Props) {
  return (
    <View style={styles.container}>
      {MODES.map((m) => {
        const isActive = mode === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            style={[styles.tab, isActive && { backgroundColor: m.activeColor }]}
            onPress={() => onChangeMode(m.key)}
            activeOpacity={0.75}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.creamDk,
    borderRadius: 28,
    padding: 5,
    gap: 4,
    width: '100%',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 22,
    gap: 5,
  },
  emoji: {
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brownMid,
    flexShrink: 1,
  },
  activeLabel: {
    color: '#fff',
  },
});
