# 🐱 ねこポモ（NekoPomo） - AGENTS.md

このファイルはCodexが自動で読む設定ファイルです。
実装前に必ずこのファイルと SPEC.md を参照してください。

---

## プロジェクト概要

猫と一緒にポモドーロ×TODO管理アプリ。
集中中は猫が静かに隣にいて、サボると睨まれる。かわいくて機能的。

---

## 技術スタック

| 役割 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Expo (React Native) | SDK 52以上 |
| 言語 | TypeScript | strict mode |
| ナビゲーション | expo-router | v3 |
| 状態管理 | Zustand | latest |
| ローカル保存 | AsyncStorage | @react-native-async-storage/async-storage |
| アニメーション | react-native-reanimated | v3 |
| 通知 | expo-notifications | latest |
| バックグラウンド | expo-task-manager | latest |
| ウィジェット | react-native-widget-extension | latest |
| フォント | expo-font / Nunito | Google Fonts |

---

## ディレクトリ構成

```
neko-pomo/
├── app/                        # expo-routerのページ
│   ├── (tabs)/
│   │   ├── index.tsx           # ホーム（猫＋タイマー/TODO）
│   │   ├── stats.tsx           # きろく
│   │   └── settings.tsx        # せってい
│   └── _layout.tsx             # ルートレイアウト
├── components/                 # 再利用コンポーネント
│   ├── cat/
│   │   ├── CatDisplay.tsx      # 猫画像＋アニメーション
│   │   └── CatBubble.tsx       # 吹き出し
│   ├── timer/
│   │   ├── CircleTimer.tsx     # 円形タイマー
│   │   └── ModeTab.tsx         # 集中/休憩タブ
│   ├── todo/
│   │   ├── TodoList.tsx        # TODOリスト
│   │   └── TodoItem.tsx        # TODOアイテム
│   └── ui/
│       └── Background.tsx      # 時刻連動背景
├── stores/                     # Zustandストア
│   ├── timerStore.ts           # タイマー状態
│   ├── todoStore.ts            # TODO状態
│   ├── catStore.ts             # 猫の状態
│   └── settingsStore.ts        # 設定
├── hooks/                      # カスタムフック
│   ├── useCatState.ts          # 猫状態の自動判定
│   ├── useBackground.ts        # 時刻→背景切り替え
│   └── useTimer.ts             # タイマーロジック
├── constants/
│   ├── colors.ts               # カラーパレット
│   ├── cats.ts                 # 猫画像マッピング
│   └── backgrounds.ts          # 背景画像マッピング
├── assets/
│   ├── images/
│   │   ├── cats/               # 猫画像6枚（PNG）
│   │   │   ├── cat-sit.png
│   │   │   ├── cat-stare.png
│   │   │   ├── cat-happy.png
│   │   │   ├── cat-sleep.png
│   │   │   ├── cat-focus.png
│   │   │   └── cat-love.png
│   │   └── backgrounds/        # 背景画像3枚（PNG）
│   │       ├── bg-morning.png
│   │       ├── bg-day.png
│   │       └── bg-night.png
│   └── fonts/
│       └── Nunito/
└── utils/
    ├── storage.ts              # AsyncStorageラッパー
    └── time.ts                 # 時刻ユーティリティ
```

---

## カラーパレット（constants/colors.ts）

```typescript
export const Colors = {
  cream:     '#FFF8F0',
  warm:      '#FFF0E0',
  peach:     '#FFD5B8',
  brown:     '#8B5E3C',
  darkBrown: '#4A2C1A',
  pinkDeep:  '#FF85A1',
  pink:      '#FFB5C8',
  greenDeep: '#5BA85B',
  shadow:    'rgba(74,44,26,0.13)',
} as const;
```

---

## 画像の読み込みルール

**必ずrequireで静的に読み込む。動的パスは使わない。**

```typescript
// ✅ 正しい
export const CAT_IMAGES = {
  sit:   require('@/assets/images/cats/cat-sit.png'),
  stare: require('@/assets/images/cats/cat-stare.png'),
  happy: require('@/assets/images/cats/cat-happy.png'),
  sleep: require('@/assets/images/cats/cat-sleep.png'),
  focus: require('@/assets/images/cats/cat-focus.png'),
  love:  require('@/assets/images/cats/cat-love.png'),
} as const;

export const BG_IMAGES = {
  morning: require('@/assets/images/backgrounds/bg-morning.png'),
  day:     require('@/assets/images/backgrounds/bg-day.png'),
  night:   require('@/assets/images/backgrounds/bg-night.png'),
} as const;

// ❌ 絶対にやらない
const img = require(`@/assets/images/cats/cat-${state}.png`); // ビルドエラー
```

---

## コーディング規約

- TypeScript strict mode（any禁止）
- コンポーネントはfunction宣言（アロー関数でもOK）
- propsは必ずinterfaceで型定義
- StyleSheetは各ファイルの末尾にまとめる
- 日本語UIテキストはコンポーネント内に直書きOK（i18n対応はv2）
- console.logは開発中のみ。リリース前に削除

---

## よく使うコマンド

```bash
# 開発サーバー起動
npx expo start

# iOSシミュレーター（Macのみ）
npx expo start --ios

# Expo Goで実機確認（QRコード）
npx expo start

# 型チェック
npx tsc --noEmit

# EAS Build（クラウドビルド）
eas build --platform ios
eas build --platform android
```

---

## やってはいけないこと

- `require()` に動的な変数を使う（画像が見つからなくなる）
- `useState` でタイマーの秒数を管理する（再レンダリングが重い → Zustandを使う）
- AsyncStorageを直接呼ぶ（必ず `utils/storage.ts` のラッパー経由）
- `StyleSheet.create` 外にスタイルを書く
- expo-routerのファイル名を変える（ルーティングが壊れる）

---

## 参照ドキュメント

- 詳細仕様 → `SPEC.md`
- 素材一覧 → `ASSETS.md`
- 実装計画 → `neko-pomo-plan.docx`