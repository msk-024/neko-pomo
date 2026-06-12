# 🐱 ねこポモ（NekoPomo）開発記録

> 猫と一緒にポモドーロ管理。集中中は静かに隣にいて、サボると睨まれる。かわいくて機能的なモバイルアプリ。

---

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| アプリ名 | ねこポモ（NekoPomo） |
| ジャンル | ポモドーロタイマー × TODO管理 |
| プラットフォーム | iOS / Android（React Native / Expo） |
| 開発スタイル | 個人開発・セルフホスト |
| 開発開始 | 2026年5月 |
| 現フェーズ | Month 1 完了（アーキテクチャ構築済み） |

---

## なぜ作ったか

既存のポモドーロアプリは「タイマーが回るだけ」で、モチベーション維持の仕組みがない。
猫というキャラクターを軸に、**集中しているときは寄り添い・サボるとじとっと睨まれる**という感情的なフィードバックを組み込むことで、単なる時間管理以上の体験を作りたかった。

看護師として臨床・産業の現場で集中管理の難しさを実感してきた経験と、独学フルスタック開発の知識を組み合わせたプロジェクト。

---

## 技術スタック

| 役割 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Expo (React Native) | SDK 54 |
| 言語 | TypeScript | 5.9（strict mode） |
| ナビゲーション | expo-router | v6 |
| 状態管理 | Zustand | v5 |
| ローカル保存 | AsyncStorage | 2.2.0 |
| アニメーション | react-native-reanimated | v4 |
| 通知 | expo-notifications | 0.32 |
| バックグラウンド処理 | expo-task-manager | 14.0 |
| フォント | Nunito（Google Fonts） | — |

---

## アーキテクチャ設計

### ディレクトリ構成

```
neko-pomo/
├── app/                        # expo-router ページ
│   ├── (tabs)/
│   │   ├── index.tsx           # ホーム（猫＋タイマー/TODO）
│   │   ├── stats.tsx           # きろく
│   │   └── settings.tsx        # せってい
│   └── _layout.tsx
├── components/
│   ├── cat/                    # CatDisplay / CatBubble
│   ├── timer/                  # CircleTimer / ModeTab
│   ├── todo/                   # TodoList / TodoItem
│   └── ui/                     # Background（時刻連動）
├── stores/                     # Zustand ストア群
├── hooks/                      # カスタムフック群
├── constants/                  # colors / cats / backgrounds
└── utils/                      # storage / time ユーティリティ
```

### 設計方針

- **責務の分離**：UI（components）・状態（stores）・ロジック（hooks）を明確に分離
- **DbC（契約による設計）**：フックに `@precondition` / `@postcondition` を明示
- **画像の静的 require**：ビルド時解決のため動的パス禁止
- **AsyncStorage ラッパー**：直接呼び出し禁止、`utils/storage.ts` 経由に統一

---

## 主要機能

### 1. 猫の状態マシン

アプリの中核。猫は6つの状態を持ち、タイマー・TODO・時刻から**優先順位付きで自動判定**される。

| 状態 | 画像 | セリフ | アニメーション | トリガー |
|---|---|---|---|---|
| `idle` | cat-sit | 今日も一緒にがんばろ🐾 | float（上下） | デフォルト |
| `focusing` | cat-focus | いっしょにがんばろ…🍅 | float | タイマー集中中 |
| `break` | cat-love | お疲れ様〜！なでなでして🧡 | pulse（拡縮） | 休憩中・集中終了時 |
| `stare` | cat-stare | まだ終わってないの…？👀 | wiggle（左右） | TODO残り＋停止中 |
| `happy` | cat-happy | やったー！全部終わったね！🎉 | pop→float | TODO全完了 |
| `sleep` | cat-sleep | zzz…もう寝る時間だよ〜😴 | float | 23:00〜5:59 |

**判定の優先順位**（コードで実装済み）:

```typescript
// hooks/useCatState.ts
export function useCatState(): CatState {
  const { isRunning, mode } = useTimerStore();
  const todos = useTodoStore((s) => s.todos);

  return useMemo((): CatState => {
    const hour = getCurrentHour();
    if (hour >= 23 || hour < 6) return 'sleep';           // 1. 深夜
    if (isRunning && mode === 'focus') return 'focusing';  // 2. 集中中
    if (isRunning && (mode === 'break' || mode === 'longBreak')) return 'break'; // 3. 休憩中
    const allDone = todos.length > 0 && todos.every((t) => t.done);
    if (allDone) return 'happy';                           // 4. 全完了
    if (todos.some((t) => !t.done)) return 'stare';        // 5. TODO残り
    return 'idle';                                         // 6. デフォルト
  }, [isRunning, mode, todos]);
}
```

### 2. ポモドーロタイマー

| モード | デフォルト | 設定範囲 |
|---|---|---|
| 集中 | 25分 | 1〜60分 |
| 休憩 | 5分 | 1〜30分 |
| 長休憩 | 15分 | 1〜60分 |

- 集中終了 → 自動で休憩タブへ切り替わり
- バックグラウンドでも動作（`expo-task-manager`）
- タイマー終了時にプッシュ通知
- アプリ再起動後もタイマー状態を復元（AsyncStorage）

**円形タイマーUI**: ピンクグラデーション（`#FF85A1` → `#FFB5C8`）のリングで残り時間を視覚化

### 3. TODOリスト

```typescript
interface Todo {
  id: string;       // uuid
  text: string;
  done: boolean;
  createdAt: number;
  doneAt?: number;
}
```

- タップで完了切り替え
- 毎日0:00に完了済みを自動削除・未完了は翌日持ち越し
- AsyncStorage に永続化

### 4. 時刻連動背景

| 時間帯 | 背景 |
|---|---|
| 6:00〜10:59 | 朝（朝日・鳥） |
| 11:00〜17:59 | 昼（青空・白雲） |
| 18:00〜5:59 | 夜（月・星） |

- 背景切り替えはクロスフェード（1.5秒）
- 10分ごとに時刻チェック
- 深夜帯は猫も `sleep` 状態に連動

### 5. 統計（きろく）

- 今日のポモドーロ数
- 完了タスク数
- 集中時間（分）
- 連続アクティブ日数（ストリーク）

---

## 状態管理（Zustand）

4つのストアで関心を分離:

| ストア | 役割 |
|---|---|
| `timerStore` | モード・残り秒数・実行状態 |
| `todoStore` | TODOリスト CRUD |
| `catStore` | 猫の名前・毛色設定 |
| `settingsStore` | タイマー時間・通知ON/OFF |

```typescript
// stores/timerStore.ts（シンプルに、副作用はhooksに委譲）
export const useTimerStore = create<TimerState>((set) => ({
  mode: 'focus',
  secondsLeft: 25 * 60,
  isRunning: false,
  tick: () => set((state) => ({ secondsLeft: Math.max(0, state.secondsLeft - 1) })),
  // ...
}));
```

---

## データ永続化

AsyncStorage に6種類のキーで管理:

```typescript
const STORAGE_KEYS = {
  TODOS:    'neko-pomo:todos',
  STATS:    'neko-pomo:stats',
  SETTINGS: 'neko-pomo:settings',
  CAT:      'neko-pomo:cat',
  TIMER:    'neko-pomo:timer',
  STREAK:   'neko-pomo:streak',
} as const;
```

直接呼び出しは禁止し、`utils/storage.ts` のラッパー経由に統一することで、型安全性とエラーハンドリングを一元管理している。

---

## カラーパレット

```typescript
export const Colors = {
  cream:     '#FFF8F0',  // メイン背景
  warm:      '#FFF0E0',  // サブ背景
  peach:     '#FFD5B8',  // タブ背景
  brown:     '#8B5E3C',  // テキスト
  darkBrown: '#4A2C1A',  // 見出し
  pinkDeep:  '#FF85A1',  // アクセント・ボタン
  pink:      '#FFB5C8',  // ライトアクセント
  greenDeep: '#5BA85B',  // 完了色
  shadow:    'rgba(74,44,26,0.13)',
} as const;
```

---

## 開発フェーズ

### Month 1（完了）— アーキテクチャ構築

- [x] Expo SDK 54 + expo-router v6 プロジェクト初期化
- [x] パッケージインストール（Zustand, Reanimated, Notifications 等）
- [x] ディレクトリ構成・tsconfig `@/` パスエイリアス設定
- [x] 全 Zustand ストア実装
- [x] `utils/storage.ts`, `utils/time.ts` 実装
- [x] `hooks/useCatState.ts`（状態判定ロジック）
- [x] `hooks/useBackground.ts`, `hooks/useTimer.ts`
- [x] 全コンポーネント骨格実装（CatDisplay, CircleTimer, TodoList 等）
- [x] 3画面実装（ホーム・きろく・せってい）
- [x] `npx tsc --noEmit` エラーゼロ確認

### Month 2（進行中）— アニメーション・永続化・通知

- [ ] Nunito フォントファイル配置・ロード設定
- [x] 猫画像・背景画像の本番素材差し替え
- [x] react-native-reanimated アニメーション実装（float/wiggle/pulse/pop）
- [x] AsyncStorage 永続化（タイマー・TODO・統計）
- [ ] expo-notifications 実装（集中終了・休憩終了通知）
- [ ] expo-task-manager バックグラウンドタイマー
- [x] クロスフェード背景切り替え

### Month 3（予定）— ウィジェット・仕上げ

- [ ] iOS/Android ウィジェット（猫の状態・TODO残数・タイマー残り時間）
- [ ] オンボーディング（猫の名前をつける3ステップ）
- [ ] ストリーク機能
- [ ] EAS Build でのリリースビルド

### v2 以降（将来構想）

- Claude API（Haiku）によるAIセリフ生成（プレミアム機能）
- 追加猫種・コスチューム
- 飼い猫AI化（写真→イラスト変換）
- 詳細統計・週次レポート

---

## 技術的なこだわり

### 画像の静的 require 徹底

React Native の Metro bundler は動的 `require()` を解決できないため、全画像をマッピングオブジェクトで静的管理:

```typescript
// ❌ やらない
const img = require(`@/assets/images/cats/cat-${state}.png`);

// ✅ こうする
export const CAT_IMAGES = {
  idle:     require('@/assets/images/cats/cat-sit.png'),
  focusing: require('@/assets/images/cats/cat-focus.png'),
  // ...
} as const;
```

### TypeScript strict mode

`any` 禁止・型推論に頼りすぎない明示的な型定義。Zod によるバリデーションも導入予定。

### DbC（Design by Contract）

主要フックに事前条件・事後条件を明示し、意図のドキュメント化と安全な拡張を両立:

```typescript
/**
 * @postcondition SPEC.md の優先順位に従った CatState を返す
 */
export function useCatState(): CatState { ... }
```

---

## デモ・動作確認手順

### 必要な環境

| ツール | バージョン | 確認コマンド |
|---|---|---|
| Node.js | 18以上推奨 | `node -v` |
| npm | 9以上 | `npm -v` |
| Expo Go（スマホアプリ） | 最新版 | App Store / Google Play |

> シミュレーターで動かす場合は Xcode（iOS）または Android Studio が別途必要です。

---

### セットアップ

```bash
# 1. リポジトリをクローン（または zip 展開）
git clone <repo-url>
cd neko-pomo

# 2. 依存パッケージをインストール
npm install --legacy-peer-deps

# 3. 開発サーバーを起動
npx expo start
```

起動すると QR コードとメニューが表示されます。

---

### 実機で試す（Expo Go）― 最速

1. スマホに **Expo Go** をインストール
2. `npx expo start` を実行
3. **iOS**: カメラアプリで QR コードを読み取る
4. **Android**: Expo Go アプリ内の「Scan QR code」で読み取る
5. アプリが自動でビルドされて起動します

> スマホと PC が **同じ Wi-Fi** につながっている必要があります。  
> つながらない場合は `npx expo start --tunnel` を試してください。

---

### シミュレーターで試す

```bash
# iOS シミュレーター（Mac のみ・Xcode 必須）
npx expo start --ios

# Android エミュレーター（Android Studio 必須）
npx expo start --android
```

---

### 現在デモで確認できること

| 機能 | 状態 |
|---|---|
| ポモドーロタイマー（集中/休憩/長休憩） | ✅ 動作 |
| 円形プログレスリング | ✅ 動作 |
| 猫の状態切り替え（6種） | ✅ 動作 |
| 猫アニメーション（float/wiggle/pulse/pop） | ✅ 動作 |
| TODO 追加・完了・削除 | ✅ 動作 |
| 時刻連動背景（朝/昼/夜） | ✅ 動作 |
| 背景クロスフェード | ✅ 動作 |
| 設定画面（タイマー時間・猫名前・通知ON/OFF） | ✅ 動作 |
| データ永続化（再起動後も保持） | ✅ 動作 |
| Nunito フォント | ⏳ 準備中（システムフォントで表示） |
| プッシュ通知 | ⏳ 未実装 |
| バックグラウンドタイマー | ⏳ 未実装 |

---

### 猫の状態を手動で確認するヒント

| 確認したい状態 | 操作 |
|---|---|
| `idle`（待機） | TODO を何も追加しないままアプリを開く |
| `stare`（じとっと） | TODO を追加してタイマーを止めたまま放置 |
| `happy`（大喜び） | TODO を全部完了にする |
| `focusing`（集中） | タイマーをスタートする（集中モード） |
| `break`（甘える） | 休憩モードでタイマーをスタートする |
| `sleep`（就寝） | 端末の時刻を 23:00〜5:59 に変更する |

---

## 学んだこと・詰まったこと

- **expo-router v6 の設定**: `expo-router` と `react-native-reanimated` の共存に babel.config.js での plugin 設定が必要
- **Zustand v5 + persist**: `create<State>()()` の二重括弧が TypeScript でのミドルウェア使用時に必須。`partialize` で保存対象を絞ると isRunning を除外できる
- **react-native-svg のインストール**: npm の peer 依存関係の競合が出る場合は `--legacy-peer-deps` で回避
- **reanimated クロスフェード**: `withTiming` の完了コールバック内で state を更新するには `runOnJS` でラップする必要がある
- **AsyncStorage の型安全ラッパー**: JSON parse 失敗時の fallback 設計が重要

---

## リポジトリ

> ローカル開発中（公開予定）

---

*最終更新: 2026-05-08*
