import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/colors";
import { CircleTimer } from "@/components/timer/CircleTimer";
import { ModeTab } from "@/components/timer/ModeTab";
import { TodoList } from "@/components/todo/TodoList";
import { CompletionOverlay } from "@/components/timer/CompletionOverlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTimer, durationSecondsFor } from "@/hooks/useTimer";
import { useTabTitle } from "@/hooks/useTabTitle";
import { useScreenWakeLock } from "@/hooks/useScreenWakeLock";
import { completedKindOf, MODE_LABELS } from "@/constants/messages";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTimerStore, type TimerMode } from "@/stores/timerStore";

type HomeTab = "timer" | "todo";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTab>("timer");
  // 実行途中にモードタブが押されたとき、確認待ちの切替先を保持する
  const [pendingMode, setPendingMode] = useState<TimerMode | null>(null);
  const { start, pause, reset, changeMode, isRunning, secondsLeft, mode } =
    useTimer();
  const settings = useSettingsStore();
  const { completedMode, setCompletedMode, setMode, setSecondsLeft } =
    useTimerStore();

  // タブタイトルに残り時間・完了通知を表示（Web専用）
  useTabTitle();
  // タイマー実行中は画面の自動スリープを抑止（Web専用）
  useScreenWakeLock(isRunning);

  // オーバーレイのボタンで次のモードへ切り替える（集中完了→休憩、休憩完了→集中）
  function handleOverlayNext() {
    const nextMode = completedMode === "focus" ? "break" : "focus";
    setMode(nextMode);
    setSecondsLeft(durationSecondsFor(nextMode, settings));
    setCompletedMode(null);
    // ダイアログ表示中に完了した場合、切替先の確認は完了フローを優先して破棄する
    setPendingMode(null);
  }

  const totalSeconds = durationSecondsFor(mode, settings);
  // 実行中または一時停止で進行途中（誤タップでリセットすると損失がある状態）
  const hasProgress =
    isRunning || (secondsLeft > 0 && secondsLeft < totalSeconds);

  // タイマーが進行途中なら確認を挟み、そうでなければ即切り替える
  function handleChangeMode(nextMode: TimerMode) {
    if (nextMode === mode) return;
    if (hasProgress) {
      setPendingMode(nextMode);
      return;
    }
    changeMode(nextMode);
  }

  function handleConfirmChangeMode() {
    if (pendingMode != null) changeMode(pendingMode);
    setPendingMode(null);
  }

  return (
    <View style={styles.container}>
      {completedMode != null && (
        <CompletionOverlay
          catName={settings.catName}
          completedKind={completedKindOf(completedMode)}
          onNext={handleOverlayNext}
        />
      )}
      {pendingMode != null && completedMode == null && (
        <ConfirmDialog
          title={`${MODE_LABELS[pendingMode]}に切り替える？`}
          message={`いま切り替えると、${MODE_LABELS[mode]}タイマーの残り時間はリセットされるよ`}
          confirmLabel="切り替える"
          cancelLabel="つづける"
          onConfirm={handleConfirmChangeMode}
          onCancel={() => setPendingMode(null)}
        />
      )}
      {/* タイマー ↔ やること タブ */}
      <View style={styles.innerTabRow}>
        <TouchableOpacity
          style={[
            styles.innerTab,
            activeTab === "timer" && styles.innerTabActive,
          ]}
          onPress={() => setActiveTab("timer")}
        >
          <Text
            style={[
              styles.innerTabText,
              activeTab === "timer" && styles.innerTabTextActive,
            ]}
          >
            ⏱ タイマー
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.innerTab,
            activeTab === "todo" && styles.innerTabActive,
          ]}
          onPress={() => setActiveTab("todo")}
        >
          <Text
            style={[
              styles.innerTabText,
              activeTab === "todo" && styles.innerTabTextActive,
            ]}
          >
            ✅ やること
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "timer" ? (
        <ScrollView
          style={styles.timerScroll}
          contentContainerStyle={styles.timerContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ModeTab mode={mode} onChangeMode={handleChangeMode} />

          <View style={styles.timerCard}>
            <CircleTimer
              secondsLeft={secondsLeft}
              totalSeconds={totalSeconds}
              mode={mode}
              isRunning={isRunning}
              onStart={start}
              onPause={pause}
            />
          </View>

          {/* リセットボタンのみ円の外に残す */}
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetButtonText}>↺ リセット</Text>
          </TouchableOpacity>
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
    flexDirection: "row",
    backgroundColor: Colors.creamDk,
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  innerTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
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
    fontWeight: "600",
    color: Colors.brownMid,
  },
  innerTabTextActive: {
    color: Colors.brown,
  },
  timerScroll: {
    flex: 1,
  },
  timerContent: {
    alignItems: "stretch",
    gap: 16,
    paddingBottom: 16,
  },
  timerCard: {
    backgroundColor: Colors.cream,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resetButton: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: Colors.creamDk,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.brownMid,
  },
  todoContent: { flex: 1 },
});
