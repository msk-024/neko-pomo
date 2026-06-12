# 🐱 ねこポモ - ASSETS.md（素材管理）

> **ドキュメント一覧**
> - [SPEC.md](./SPEC.md)：機能仕様・アーキテクチャ・ロードマップ
> - 本ファイル（ASSETS.md）：画像・フォント・素材の管理
> - [CLAUDE.md](./CLAUDE.md)：AIアシスタント向け開発ルール

---

## チェックリスト（一覧）

### 制作済み ✅
- [x] cat-sit.png（待機・デフォルト）
- [x] cat-focus.png（集中中）
- [x] cat-love.png（休憩・甘える）
- [x] cat-stare.png（じとっと睨む）
- [x] cat-happy.png（TODO全完了・大喜び）
- [x] cat-sleep.png（深夜・就寝）
- [x] bg-morning.png（朝：6:00〜10:59）
- [x] bg-day.png（昼：11:00〜17:59）
- [x] bg-night.png（夜：18:00〜5:59）

### 未制作 ❌
- [ ] アプリアイコン（1024×1024px） → `assets/icon.png`
- [ ] スプラッシュ画像（1284×2778px）
- [ ] App Storeスクリーンショット（6.7インチ・5.5インチ）
- [ ] Nunitoフォントファイル（Google Fontsからダウンロード）
- [ ] 環境音ファイル（v2: 雨/カフェ/森）→ `assets/sounds/`

---

## 1. 猫画像一覧

保存場所：`assets/images/cats/`

| ファイル名 | 状態キー | 使うシーン | アニメーション |
|---|---|---|---|
| cat-sit.png | `idle` | デフォルト・待機中 | float |
| cat-focus.png | `focusing` | ポモドーロ集中中 | float |
| cat-love.png | `break` | 休憩タイム・甘えてくる | pulse |
| cat-stare.png | `stare` | TODOが残ってる・じとっと睨む | wiggle |
| cat-happy.png | `happy` | TODO全完了・大喜び | pop→float |
| cat-sleep.png | `sleep` | 深夜（23:00〜5:59） | float |

### 画像スペック

- 形式：PNG（透過背景）
- 推奨サイズ：600×600px以上（元素材）
- 実際の表示サイズ：**155×155px**（`CatDisplay` コンポーネント内）
- 背景：透明（remove.bg で処理済みのもの）

### コード内での参照

```typescript
// constants/cats.ts
export const CAT_IMAGES = {
  idle:     require('@/assets/images/cats/cat-sit.png'),
  focusing: require('@/assets/images/cats/cat-focus.png'),
  break:    require('@/assets/images/cats/cat-love.png'),
  stare:    require('@/assets/images/cats/cat-stare.png'),
  happy:    require('@/assets/images/cats/cat-happy.png'),
  sleep:    require('@/assets/images/cats/cat-sleep.png'),
} as const;

export type CatState = keyof typeof CAT_IMAGES;
```

> ⚠️ **動的パス禁止**：`require(\`@/assets/images/cats/cat-${state}.png\`)` はビルドエラーになる。
> 必ず `CAT_IMAGES[state]` 経由で参照すること。

### 透過処理について

猫画像は白背景で生成したため、remove.bg で透過処理が必要。

1. https://www.remove.bg にアクセス
2. 猫画像をアップロード
3. 透過PNGをダウンロード
4. `assets/images/cats/` に上書き保存

---

## 2. 背景画像一覧

保存場所：`assets/images/backgrounds/`

| ファイル名 | 時間帯 | 窓の外の様子 |
|---|---|---|
| bg-morning.png | 6:00〜10:59 | 朝日・鳥が飛んでいる |
| bg-day.png | 11:00〜17:59 | 青空・白い雲 |
| bg-night.png | 18:00〜5:59 | 夜空・満月・星 |

### 画像スペック

- 形式：PNG
- 推奨サイズ：860×600px以上（横長の部屋シーン）
- 実際の表示エリア：画面幅 × `height * 0.35`（CatHeader の高さ）
- 構図：部屋の内側から窓を見た視点。中央に窓が来るように配置すること
- 共通要素：木製家具・本棚・肉球ランプ・植物・窓辺のクッション
- **中央に主要シーン（窓）が来るように構図を調整**すること（端に寄せない）

### コード内での参照

```typescript
// constants/backgrounds.ts
export const BG_IMAGES = {
  morning: require('@/assets/images/backgrounds/bg-morning.png'),
  day:     require('@/assets/images/backgrounds/bg-day.png'),
  night:   require('@/assets/images/backgrounds/bg-night.png'),
} as const;

export type BgType = keyof typeof BG_IMAGES;

export function getBgType(hour: number): BgType {
  if (hour >= 6 && hour < 11)  return 'morning';
  if (hour >= 11 && hour < 18) return 'day';
  return 'night';
}
```

### 表示方式（実装済み）

```tsx
// components/cat/CatHeader.tsx
// Image コンポーネント + resizeMode="cover" + absoluteFill
// → react-native-web で object-fit:cover / object-position:center が機能し、
//    画像の中央が正しく表示される
<Image
  source={BG_IMAGES[bgType]}
  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
  resizeMode="cover"
/>
```

---

## 3. フォント

| フォント名 | 用途 | ウェイト | 状態 |
|---|---|---|---|
| Nunito | 全テキスト | 400・600・700・800 | ❌ 未導入（現在はシステムフォント） |

### ダウンロード元

Google Fonts: https://fonts.google.com/specimen/Nunito

必要なファイル：
- `Nunito-Regular.ttf`（400）
- `Nunito-SemiBold.ttf`（600）
- `Nunito-Bold.ttf`（700）
- `Nunito-ExtraBold.ttf`（800）

保存先：`assets/fonts/Nunito/`

### 導入方法（フォントファイル入手後）

```typescript
// app/_layout.tsx に追加
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  'Nunito-Regular':   require('@/assets/fonts/Nunito/Nunito-Regular.ttf'),
  'Nunito-SemiBold':  require('@/assets/fonts/Nunito/Nunito-SemiBold.ttf'),
  'Nunito-Bold':      require('@/assets/fonts/Nunito/Nunito-Bold.ttf'),
  'Nunito-ExtraBold': require('@/assets/fonts/Nunito/Nunito-ExtraBold.ttf'),
});
```

---

## 4. アプリアイコン・ストア素材

| 用途 | サイズ | 保存先 | 状態 |
|---|---|---|---|
| アプリアイコン | 1024×1024px | `assets/icon.png` | ❌ 未制作 |
| スプラッシュ画面 | 1284×2778px | `assets/splash.png` | ❌ 未制作 |
| アダプティブアイコン（Android） | 1024×1024px | `assets/adaptive-icon.png` | ❌ 未制作 |
| ファビコン（Web用） | 48×48px | `assets/favicon.png` | ❌ 未制作 |
| App Store スクリーンショット | 6.7インチ・5.5インチ | — | ❌ 未制作（公開時に必要） |

アプリアイコン案：むぎの顔＋ピンクのまるい背景（`cat-happy.png` ベース）

---

## 5. v2 予定素材

### 環境音ファイル（§10-③）

保存先：`assets/sounds/`

| ファイル名 | 内容 | ループ |
|---|---|---|
| rain.mp3 | 雨音 | ✅ |
| cafe.mp3 | カフェBGM | ✅ |
| forest.mp3 | 森の音 | ✅ |

- 著作権フリー素材を使用すること（freesound.org, pixabay 等）
- ループ用に30〜60秒程度のクリップを用意
- ファイルサイズ目安：1ファイル 200KB 以内

### 追加猫パターン（§10-⑥ もくもく部屋）

バーチャル共同作業部屋で複数ユーザーの猫を区別するために、追加の猫スタイルが必要。
- 現在：キジトラ / 黒猫 / 三毛（設定で切り替え、同一画像セット）
- v2：猫種ごとに別の画像セットを用意（各6枚）
