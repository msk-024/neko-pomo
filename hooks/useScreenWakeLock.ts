import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * active の間、画面の自動スリープを抑止する（Web専用・Wake Lock API）。
 * タイマー実行中に画面が消えて猫も残り時間も見えなくなるのを防ぐ。
 * @invariant ネイティブ環境・未対応ブラウザでは何もしない
 * @postcondition activeがfalseになる（またはアンマウント）とロックを解放する
 */
export function useScreenWakeLock(active: boolean): void {
  useEffect(() => {
    if (Platform.OS !== "web" || !active) return;
    // 型定義上は必ず存在するが、古いブラウザでは未実装なので実行時にも確認する
    if (!("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    async function requestWakeLock(): Promise<void> {
      try {
        const acquired = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await acquired.release();
          return;
        }
        sentinel = acquired;
      } catch {
        // 低電力モードや非対応環境では取得に失敗する。スリープ抑止できないだけなので無視
      }
    }

    // タブが非表示になるとロックは自動解放されるため、復帰時に再取得する
    function handleVisibilityChange(): void {
      if (document.visibilityState === "visible" && !cancelled) {
        void requestWakeLock();
      }
    }

    void requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void sentinel?.release().catch(() => undefined);
    };
  }, [active]);
}
