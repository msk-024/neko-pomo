import { Platform } from "react-native";

/**
 * AudioContextはユーザー操作中に生成・resumeしたものを使い回す。
 * iOS Safariは操作直後しか音を出せないため、タイマー開始時にunlockAudio()で
 * 解除しておかないと、25分後の完了チャイムが自動再生制限で鳴らない。
 */
let sharedAudioContext: AudioContext | null = null;

function getAudioContextClass(): typeof AudioContext | undefined {
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

/**
 * @precondition ユーザー操作（ボタン押下等）のハンドラ内から呼ぶこと
 * @postcondition AudioContextが生成・resumeされ、以後のチャイムが自動再生制限にかからなくなる
 */
export function unlockAudio(): void {
  if (Platform.OS !== "web") return;
  try {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return;
    sharedAudioContext ??= new AudioContextClass();
    if (sharedAudioContext.state === "suspended") {
      void sharedAudioContext.resume();
    }
  } catch {
    // 未対応環境では何もしない
  }
}

/** C5→E5→G5の3音チャイムを鳴らす。未対応環境では何もしない */
export function playCompletionChime(): void {
  if (Platform.OS !== "web") return;
  try {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return;

    const ctx = (sharedAudioContext ??= new AudioContextClass());
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const notes = [523.25, 659.25, 783.99]; // C5 → E5 → G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch {
    // Autoplay制限などで失敗しても無視
  }
}

/** 完了バイブレーション。AndroidのChromeのみ有効 */
export function vibrateCompletion(): void {
  if (Platform.OS !== "web") return;
  if (!("vibrate" in navigator)) return;
  navigator.vibrate([200, 100, 200]);
}
