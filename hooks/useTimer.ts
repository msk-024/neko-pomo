import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useTimerStore, TimerMode } from '@/stores/timerStore';
import { useSettingsStore, type Settings } from '@/stores/settingsStore';
import { useStatsStore } from '@/stores/statsStore';
import {
  scheduleTimerEndNotificationAsync,
  cancelTimerNotificationAsync,
} from '@/utils/notifications';

function durationSecondsFor(mode: TimerMode, settings: Settings): number {
  if (mode === 'focus') return settings.focusMinutes * 60;
  if (mode === 'break') return settings.breakMinutes * 60;
  return settings.longBreakMinutes * 60;
}

/**
 * @postcondition タイマー実行中は1秒ごと、およびフォアグラウンド復帰時にendAtから残り時間を再計算する
 * @invariant isRunning===falseのときintervalもendAtも存在しない
 * @invariant isRunning===trueのときendAtは未来（または直前に過ぎた）の終了予定時刻を保持する
 */
export function useTimer() {
  const {
    isRunning, secondsLeft, mode, notificationId,
    tick, setIsRunning, setMode, setSecondsLeft, setEndAt, setNotificationId,
  } = useTimerStore();
  const settings = useSettingsStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 実行中はendAtから1秒ごとに残り時間を再計算する。
  // マウント直後にも一度tick()を呼び、バックグラウンド中に経過した時間やアプリ再起動を即座に反映する。
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  // バックグラウンドから復帰した瞬間にも再計算する（バックグラウンド中はintervalが止まるため）
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isRunning) tick();
    });
    return () => subscription.remove();
  }, [isRunning, tick]);

  useEffect(() => {
    if (!isRunning || secondsLeft > 0) return;

    setIsRunning(false);
    setEndAt(null);
    setNotificationId(null);

    if (mode === 'focus') {
      // 集中完了：ポモドーロを記録してから休憩へ
      useStatsStore.getState().recordPomo(settings.focusMinutes);
      setMode('break');
      setSecondsLeft(settings.breakMinutes * 60);
    } else {
      // 休憩完了：集中へ戻る
      setMode('focus');
      setSecondsLeft(settings.focusMinutes * 60);
    }
  }, [secondsLeft, isRunning, mode, setIsRunning, setMode, setSecondsLeft, setEndAt, setNotificationId, settings]);

  async function cancelScheduledNotification() {
    if (!notificationId) return;
    await cancelTimerNotificationAsync(notificationId);
    setNotificationId(null);
  }

  async function start() {
    const endTimestamp = Date.now() + secondsLeft * 1000;
    setEndAt(endTimestamp);
    setIsRunning(true);

    if (settings.notificationEnabled) {
      const id = await scheduleTimerEndNotificationAsync(endTimestamp, mode, settings.catName);
      setNotificationId(id);
    }
  }

  async function pause() {
    setIsRunning(false);
    setEndAt(null);
    await cancelScheduledNotification();
  }

  async function reset() {
    setIsRunning(false);
    setEndAt(null);
    await cancelScheduledNotification();
    setSecondsLeft(durationSecondsFor(mode, settings));
  }

  async function changeMode(nextMode: TimerMode) {
    setIsRunning(false);
    setEndAt(null);
    await cancelScheduledNotification();
    setMode(nextMode);
    setSecondsLeft(durationSecondsFor(nextMode, settings));
  }

  return { start, pause, reset, changeMode, isRunning, secondsLeft, mode };
}
