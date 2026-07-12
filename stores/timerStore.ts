import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter, STORAGE_KEYS } from "@/utils/storage";

export type TimerMode = "focus" | "break" | "longBreak";

interface TimerState {
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
  /** 実行中タイマーの終了予定時刻（Unix ms）。停止中はnull */
  endAt: number | null;
  /** 予約済み終了通知の識別子。未予約またはWebではnull */
  notificationId: string | null;
  /** 直前に完了したタイマーのモード。オーバーレイ表示中のみ値を持つ。リロード後もオーバーレイを復元できるよう永続化する */
  completedMode: TimerMode | null;
  setMode: (mode: TimerMode) => void;
  setSecondsLeft: (seconds: number) => void;
  setIsRunning: (running: boolean) => void;
  setEndAt: (endAt: number | null) => void;
  setNotificationId: (notificationId: string | null) => void;
  setCompletedMode: (mode: TimerMode | null) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      mode: "focus",
      secondsLeft: 25 * 60,
      isRunning: false,
      endAt: null,
      notificationId: null,
      completedMode: null,
      setMode: (mode) => set({ mode }),
      setSecondsLeft: (secondsLeft) => set({ secondsLeft }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setEndAt: (endAt) => set({ endAt }),
      setNotificationId: (notificationId) => set({ notificationId }),
      setCompletedMode: (completedMode) => set({ completedMode }),
      // endAt（終了予定の絶対時刻）から残り秒数を再計算する。
      // バックグラウンド復帰時やアプリ再起動後も正しい残り時間を導けるようにするため、
      // 単純な「1秒減算」ではなく現在時刻との差分で求める。
      tick: () =>
        set((state) => {
          if (state.endAt == null) return state;
          const secondsLeft = Math.max(
            0,
            Math.round((state.endAt - Date.now()) / 1000),
          );
          return { secondsLeft };
        }),
    }),
    {
      name: STORAGE_KEYS.TIMER,
      storage: createJSONStorage(() => asyncStorageAdapter),
      // isRunning/endAt も保存し、アプリを閉じてもタイマーが進み続けるようにする
      partialize: (state) => ({
        mode: state.mode,
        secondsLeft: state.secondsLeft,
        isRunning: state.isRunning,
        endAt: state.endAt,
        notificationId: state.notificationId,
        // 完了オーバーレイ表示待ちのままリロードされても復元できるように保存する
        completedMode: state.completedMode,
      }),
    },
  ),
);
