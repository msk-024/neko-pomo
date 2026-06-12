export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function isMidnight(hour: number, minute: number): boolean {
  return hour === 0 && minute === 0;
}
