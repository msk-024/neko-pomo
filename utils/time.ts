export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Dateを端末ローカルの YYYY-MM-DD 文字列にする */
export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 今日の日付（YYYY-MM-DD）。端末ローカル時間の0時で切り替わる。
 * 注意: toISOString()はUTC基準のため使わないこと（日本では朝9時に日付が変わってしまう）
 */
export function getTodayString(): string {
  return toDateString(new Date());
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function isMidnight(hour: number, minute: number): boolean {
  return hour === 0 && minute === 0;
}
