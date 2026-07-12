import { useEffect } from "react";
import { Platform } from "react-native";
import { APP_NAME, APP_TITLE } from "@/constants/meta";
import { COMPLETION_MESSAGES, completedKindOf } from "@/constants/messages";
import { useTimerStore } from "@/stores/timerStore";
import { formatSeconds } from "@/utils/time";

function isWebDocumentAvailable(): boolean {
  return Platform.OS === "web" && typeof document !== "undefined";
}

/**
 * タイマーの状態をブラウザのタブタイトルに反映する（Web専用）。
 * - 実行中: 「🍅 24:15｜ねこポモ」のように残り時間を表示
 * - 完了オーバーレイ表示中: 「🍅 集中おわったよ！」で知らせる
 * - それ以外: 正式タイトルに戻す
 * @invariant ネイティブ環境では何もしない
 */
export function useTabTitle(): void {
  const { isRunning, secondsLeft, mode, completedMode } = useTimerStore();

  useEffect(() => {
    if (!isWebDocumentAvailable()) return;

    if (completedMode != null) {
      document.title =
        COMPLETION_MESSAGES[completedKindOf(completedMode)].title;
      return;
    }
    if (isRunning) {
      const emoji = mode === "focus" ? "🍅" : "☕";
      document.title = `${emoji} ${formatSeconds(secondsLeft)}｜${APP_NAME}`;
      return;
    }
    document.title = APP_TITLE;
  }, [isRunning, secondsLeft, mode, completedMode]);

  // アンマウント時は正式タイトルへ復元する
  useEffect(() => {
    return () => {
      if (!isWebDocumentAvailable()) return;
      document.title = APP_TITLE;
    };
  }, []);
}
