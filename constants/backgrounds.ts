export const BG_IMAGES = {
  morning: require('@/assets/images/backgrounds/bg-morning.webp'),
  day:     require('@/assets/images/backgrounds/bg-day.webp'),
  night:   require('@/assets/images/backgrounds/bg-night.webp'),
} as const;

export type BgType = keyof typeof BG_IMAGES;

export function getBgType(hour: number): BgType {
  if (hour >= 6 && hour < 11)  return 'morning';
  if (hour >= 11 && hour < 18) return 'day';
  return 'night';
}
