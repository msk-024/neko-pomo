import type { CatColor } from '@/stores/settingsStore';

// ── 猫の状態 ──────────────────────────────────────────────────────────────

export type CatState = 'idle' | 'focusing' | 'break' | 'stare' | 'happy' | 'sleep';

export const CAT_MESSAGES: Record<CatState, string> = {
  idle:     '今日も一緒にがんばろ🐾',
  focusing: 'いっしょにがんばろ…🍅',
  break:    'お疲れ様〜！なでなでして🧡',
  stare:    'まだ終わってないの…？👀',
  happy:    'やったー！全部終わったね！🎉',
  sleep:    'zzz…もう寝る時間だよ〜😴',
};

// ── 毛色ごとの画像セット ──────────────────────────────────────────────────
// ⚠️ require() のパスは必ず静的文字列で書くこと（動的パスはビルドエラー）

export const CAT_IMAGES_BY_COLOR: Record<CatColor, Record<CatState, ReturnType<typeof require>>> = {
  tabby: {
    idle:     require('@/assets/images/cats/tabby/tabby-sit.webp'),
    focusing: require('@/assets/images/cats/tabby/tabby-focus.webp'),
    break:    require('@/assets/images/cats/tabby/tabby-love.webp'),
    stare:    require('@/assets/images/cats/tabby/tabby-stare.webp'),
    happy:    require('@/assets/images/cats/tabby/tabby-happy.webp'),
    sleep:    require('@/assets/images/cats/tabby/tabby-sleep.webp'),
  },
  black: {
    idle:     require('@/assets/images/cats/black/black-sit.webp'),
    focusing: require('@/assets/images/cats/black/black-focus.webp'),
    break:    require('@/assets/images/cats/black/black-love.webp'),
    stare:    require('@/assets/images/cats/black/black-stare.webp'),
    happy:    require('@/assets/images/cats/black/black-happy.webp'),
    sleep:    require('@/assets/images/cats/black/black-sleep.webp'),
  },
  calico: {
    idle:     require('@/assets/images/cats/calico/calico-sit.webp'),
    focusing: require('@/assets/images/cats/calico/calico-focus.webp'),
    break:    require('@/assets/images/cats/calico/calico-love.webp'),
    stare:    require('@/assets/images/cats/calico/calico-stare.webp'),
    happy:    require('@/assets/images/cats/calico/calico-happy.webp'),
    sleep:    require('@/assets/images/cats/calico/calico-sleep.webp'),
  },
};
