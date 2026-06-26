import { Platform } from 'react-native';

/** C5→E5→G5の3音チャイムを鳴らす。未対応環境では何もしない */
export function playCompletionChime(): void {
  if (Platform.OS !== 'web') return;
  try {
    const AudioContextClass =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99]; // C5 → E5 → G5

    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
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
  if (Platform.OS !== 'web') return;
  if (!('vibrate' in navigator)) return;
  navigator.vibrate([200, 100, 200]);
}
