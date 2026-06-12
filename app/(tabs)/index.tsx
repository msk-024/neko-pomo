import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/colors';
import { CircleTimer } from '@/components/timer/CircleTimer';
import { ModeTab } from '@/components/timer/ModeTab';
import { TodoList } from '@/components/todo/TodoList';
import { useTimer } from '@/hooks/useTimer';
import { useSettingsStore } from '@/stores/settingsStore';

type HomeTab = 'timer' | 'todo';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTab>('timer');
  const { start, pause, reset, changeMode, isRunning, secondsLeft, mode } = useTimer();
  const settings = useSettingsStore();

  const totalSeconds =
    mode === 'focus' ? settings.focusMinutes * 60
    : mode === 'break' ? settings.breakMinutes * 60
    : settings.longBreakMinutes * 60;

  return (
    <View style={styles.container}>
      {/* タイマー ↔ やること タブ */}
      <View style={styles.innerTabRow}>
        <TouchableOpacity
          style={[styles.innerTab, activeTab === 'timer' && styles.innerTabActive]}
          onPress={() => setActiveTab('timer')}
        >
          <Text style={[styles.innerTabText, activeTab === 'timer' && styles.innerTabTextActive]}>
            ⏱ タイマー
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.innerTab, activeTab === 'todo' && styles.innerTabActive]}
          onPress={() => setActiveTab('todo')}
        >
          <Text style={[styles.innerTabText, activeTab === 'todo' && styles.innerTabTextActive]}>
            ✅ やること
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'timer' ? (
        <ScrollView
          style={styles.timerScroll}
          contentContainerStyle={styles.timerContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ModeTab mode={mode} onChangeMode={changeMode} />

          <View style={styles.timerCard}>
            <CircleTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} mode={mode} />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetButtonText}>↺</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startButton, isRunning && styles.pauseButton]}
              onPress={isRunning ? pause : start}
            >
              <Text style={styles.startButtonText}>
                {isRunning ? '⏸ 一時停止' : '▶ スタート'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.todoContent}>
          <TodoList />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  innerTabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.creamDk,
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  innerTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  innerTabActive: {
    backgroundColor: Colors.cream,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  innerTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brownMid,
  },
  innerTabTextActive: {
    color: Colors.brown,
  },
  timerScroll: {
    flex: 1,
  },
  timerContent: {
    alignItems: 'stretch',
    gap: 16,
    paddingBottom: 16,
  },
  timerCard: {
    backgroundColor: Colors.cream,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  resetButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.creamDk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 24,
    color: Colors.brownMid,
  },
  startButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: Colors.brownMid,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  todoContent: { flex: 1 },
});
