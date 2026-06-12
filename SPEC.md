# 🐱 ねこポモ - SPEC.md（詳細仕様書）

> **ドキュメント一覧**
> - 本ファイル（SPEC.md）：機能仕様・アーキテクチャ・ロードマップ
> - [ASSETS.md](./ASSETS.md)：画像・フォント・素材の管理
> - [CLAUDE.md](./CLAUDE.md)：AIアシスタント向け開発ルール

---

## 0. 実装ステータス（2026-06-09時点）

| セクション | 機能 | 状態 |
|---|---|---|
| 1 | 画面構成・ナビゲーション | ✅ 完了 |
| 2 | 猫の状態ロジック＋アニメーション | ✅ 完了 |
| 3 | ポモドーロタイマー（バックグラウンド） | ✅ 完了（§3参照） |
| 3 | タイマー終了→自動モード切り替え | ❌ 未実装 |
| 4 | TODOリスト（追加・完了・永続化） | ✅ 完了 |
| 4 | TODOスワイプ削除 | 🔜 v1.1 |
| 5 | 時刻連動背景（クロスフェード） | ✅ 完了 |
| 6 | AsyncStorage永続化 | ✅ 完了（タイマー・TODO・設定） |
| 6 | きろくデータ記録（statsStore） | ❌ 未実装 |
| 7 | プッシュ通知（タイマー終了） | ✅ 完了（Platform guard済） |
| 8 | ウィジェット | 🔜 ネイティブ版移行後 |
| 9 | オンボーディング（名前入力） | ❌ 未実装 |
| 10 | プレミアム機能 | 🔜 v2以降 |
| 11 | Web先行リリース方針 | ✅ 決定・実装済み |

**次に着手するタスク：**
1. きろくデータ記録（statsStore + 画面拡張）
2. タイマー終了→自動モード切り替え
3. オンボーディング

---

## 1. 画面構成・遷移

```
起動
 └── オンボーディング（初回のみ）※未実装
      └── 猫の名前をつける → ホーム

ホーム（tabs/index）
 ├── 上エリア（固定・全タブ共通）：背景＋猫＋吹き出し  ← CatHeader コンポーネント
 └── 下エリア（内側タブ切り替え）
      ├── ⏱ タイマータブ
      │    ├── モードタブ（集中🍅/休憩🫐/長休憩🌿）
      │    ├── 円形タイマー
      │    └── スタート/リセットボタン
      └── ✅ やることタブ
           ├── タスク追加フォーム
           └── タスクリスト

きろく（tabs/stats）
 ├── 2×2 統計カード（今日のポモドーロ/完了タスク/集中時間/連続日数）
 ├── アクティビティカレンダー ※未実装
 ├── 週間グラフ ※未実装
 └── むぎの一言カード

せってい（tabs/settings）
 ├── 猫の名前
 ├── タイマー時間設定（ステッパー）
 ├── 毛色えらび（キジトラ/黒猫/三毛）
 └── 通知ON/OFF

ボトムナビ：🏠ホーム / 📊きろく / ⚙️せってい
```

### アーキテクチャポイント

- `app/(tabs)/_layout.tsx` に `<CatHeader>` を置き、**全タブで猫エリアが共有される**
- 各タブ画面は「下半分のコンテンツ」のみを担当する
- PC表示：最大幅430px、中央寄せ（両側に木目調背景）

---

## 2. 猫の状態ロジック

### 状態一覧

| 状態キー | 画像 | セリフ | アニメーション | トリガー |
|---|---|---|---|---|
| `idle` | cat-sit.png | 今日も一緒にがんばろ🐾 | float | デフォルト |
| `focusing` | cat-focus.png | いっしょにがんばろ…🍅 | float | タイマー集中中 |
| `break` | cat-love.png | お疲れ様〜！なでなでして🧡 | pulse | 休憩タイマー中 |
| `stare` | cat-stare.png | まだ終わってないの…？👀 | wiggle | TODOが残っている＋タイマー停止中 |
| `happy` | cat-happy.png | やったー！全部終わったね！🎉 | pop→float | TODO全完了 |
| `sleep` | cat-sleep.png | zzz…もう寝る時間だよ〜😴 | float | 23:00〜5:59 |

### 状態判定の優先順位（上が高い）

```
1. 深夜（23:00〜5:59）→ sleep
2. タイマー集中中     → focusing
3. タイマー休憩中     → break
4. TODO全完了        → happy
5. TODO残あり        → stare
6. それ以外          → idle
```

### アニメーション定義

```
float  : 0px → -8px → 0px を3秒でループ（Easing.inOut(sin)）
wiggle : 0deg → -5deg → 5deg → 0deg を0.45秒でループ
pulse  : scale(1) → scale(1.05) → scale(1) を2.2秒でループ
pop    : scale(0.7) opacity(0.4) → scale(1) opacity(1) を0.45秒（一回のみ）
```

---

## 3. ポモドーロタイマー仕様

### 時間設定

| モード | デフォルト | 設定範囲 |
|---|---|---|
| 集中 | 25分 | 1〜60分 |
| 休憩 | 5分 | 1〜60分 |
| 長休憩 | 15分 | 1〜60分 |

### バックグラウンドタイマーの実装方式（重要）

**方式：タイムスタンプベース（Forest/Be Focused と同じ業界標準パターン）**

`expo-task-manager` は15分以上のインターバルにしか対応しないためタイマーには使用しない。

```
開始時：endAt = Date.now() + secondsLeft * 1000 をストアに保存
毎秒  ：secondsLeft = max(0, round((endAt - Date.now()) / 1000))
復帰時：AppState listener がフォアグラウンド検知 → tick() で即座に再計算
通知  ：scheduleNotificationAsync({ trigger: { date: endAt } }) で endAt に通知予約
```

### 動作仕様

| 仕様 | 状態 |
|---|---|
| バックグラウンドタイマー（AppState+通知で実現） | ✅ 完了 |
| タイマー終了時プッシュ通知 | ✅ 完了 |
| アプリ終了→再起動後のタイマー状態復元 | ✅ 完了（isRunning/endAt を永続化） |
| 集中終了→休憩へ自動モード切り替え | ❌ 未実装 |
| 休憩終了→集中へ自動モード切り替え | ❌ 未実装 |
| リセットボタン | ✅ 完了 |

### 円形タイマーUI

```
外側リング：残り時間をピンクのグラデーションで表示（react-native-svg）
内側      ：モード名 + 時間表示（MM:SS）
リング色  ：ピンク(#FF85A1)→ライトピンク(#FFB5C8)
```

---

## 4. TODOリスト仕様

### データ構造

```typescript
interface Todo {
  id: string;        // uuid
  text: string;
  done: boolean;
  createdAt: number;
  doneAt?: number;
}
```

### 動作仕様

| 仕様 | 状態 |
|---|---|
| 追加（テキスト入力→Enterまたは＋ボタン） | ✅ 完了 |
| 完了（タップでdone切り替え） | ✅ 完了 |
| 削除（スワイプ） | 🔜 v1.1 |
| 毎日0:00に完了済みを自動リセット | ✅ 完了 |
| AsyncStorageへの永続化 | ✅ 完了 |

---

## 5. 時刻連動背景

| 時間帯 | 背景ファイル |
|---|---|
| 6:00〜10:59 | bg-morning.png |
| 11:00〜17:59 | bg-day.png |
| 18:00〜5:59 | bg-night.png |

- `CatHeader` 内でのみ表示（猫エリアの背景のみ。画面全体ではない）
- 切り替えはクロスフェード（1.5秒）
- 10分ごとにチェック + 起動時即座に判定

---

## 6. データ永続化（AsyncStorage）

### 実装済みストア

| ストア | キー | 内容 | 状態 |
|---|---|---|---|
| timerStore | `neko-pomo:timer` | isRunning / endAt / mode / notificationId | ✅ |
| todoStore | `neko-pomo:todos` | Todo[] | ✅ |
| settingsStore | `neko-pomo:settings` | catName / 各タイマー時間 / catColor / notificationEnabled | ✅ |
| statsStore | `neko-pomo:stats` | ポモドーロ数・集中時間・タスク完了数・連続日数 | ❌ 未実装 |

### statsStore の型設計（未実装）

```typescript
interface DailyStats {
  date: string;          // YYYY-MM-DD
  pomosCount: number;    // 今日のポモドーロ数
  focusMinutes: number;  // 今日の集中時間（分）
  todosDone: number;     // 今日の完了タスク数
}

interface StreakData {
  currentStreak: number;  // 現在の連続日数
  lastActiveDate: string; // 最終アクティブ日（YYYY-MM-DD）
}

// 将来の履歴表示用（アクティビティカレンダー等）
interface StatsHistory {
  [date: string]: DailyStats; // キーはYYYY-MM-DD
}
```

---

## 7. 通知仕様

```typescript
// 集中タイマー終了
title: `${catName}が呼んでいるよ！`
body:  '集中タイム終了！少し休憩しよう🍅'

// 休憩タイマー終了
title: 'さあ、また頑張ろう！'
body:  `${catName}も応援してるよ🐱`
```

- `Platform.OS === 'web'` の場合は通知をスキップ（ブラウザの制限）
- 通知IDは `notificationId` として timerStore に保存し、pause/reset時にキャンセル

---

## 8. ウィジェット仕様

**対象：ネイティブ版（iOS/Android）のみ。Web版では不可。**

### 小サイズ（2×2）
- 猫の顔アイコン（現在の状態）
- 残TODO数バッジ

### 中サイズ（4×2）
- 猫の画像（現在の状態）
- 残TODO数「あと○個」
- タイマーが動いている場合は残り時間

---

## 9. オンボーディング仕様（未実装）

初回起動時のみ表示する：

```
Step 1: 猫の名前をつける
  - テキスト入力（デフォルト：むぎ）
  - 猫の画像（happy状態）を表示

Step 2: 「はじめよう！」ボタン → ホームへ遷移
```

実装場所：`app/onboarding.tsx`（expo-routerで `initialRouteName` で制御）

---

## 10. v2 ロードマップ

### ③ アンビエントサウンド（環境音）

**概要：** 集中中に雨音・カフェBGM等を再生する機能

**実装方針：**
- ライブラリ：`expo-av`（Expo管理ライブラリ。インストール承認が必要）
- 音源ファイル：`assets/sounds/` にMP3/AACを配置
- 設定画面に「環境音えらび」セクションを追加（なし/雨/カフェ/森）
- タイマー開始→再生、一時停止/終了→停止

**注意点：**
- 音源の著作権確認が必要（フリー素材サイトを使うこと）
- Web版：ブラウザの自動再生ポリシーでユーザー操作後のみ再生可能
- ファイルサイズに注意（ループ用に短いクリップを使う）

---

### ④ タスクへのポモドーロ割り当て

**概要：** TODO項目に「このタスクに何ポモ使うか」を設定し、進捗を可視化する機能

**実装方針：**
- `Todo` インターフェースに `estimatedPomos?: number` と `completedPomos: number` を追加
- TodoItemに「🍅×n」表示を追加
- 集中タイマー完了時に「今取り組んだタスクはどれ？」を選択させる（または自動カウント）

**注意点：**
- UXが複雑になりすぎないよう、最初は「見積もりポモ数」のみ入力できる最小実装から始める
- タスクとポモドーロの紐付けはオプション扱い（設定しなくても使える）

---

### ⑥ バーチャル共同作業部屋（もくもく部屋）

**概要：** 同じ部屋に入ったユーザー同士がリアルタイムでポモドーロを同期する機能

**実装方針：**
- バックエンド：Supabase Realtime（または PubNub）
- 部屋コード（6桁）で入室。最大4人
- 参加者の猫アイコンと集中/休憩状態を表示
- タイマー同期は「同じ部屋にいる全員が同じタイマーに従う」方式

**注意点：**
- バックエンドが必要なため工数が大きい（他のv2機能より難易度高）
- 猫は現在1パターンのみ → 複数パターンの猫画像生成が先決
- Supabase無料枠：50MB DB / 500MB Storage / 2GB転送

---

### その他 v2候補

| 機能 | 概要 |
|---|---|
| AIセリフ生成 | Claude API Haiku でプレミアム会員向けの毎回違うセリフ |
| 追加猫種 | 猫画像を差し替えるだけでOK（assets管理） |
| 詳細統計・週次レポート | StatsHistory を利用した週間グラフ・月間サマリー |
| PWA化 | Web版をホーム画面に追加できるようにする（manifest.json） |

---

## 11. プラットフォーム展開方針（決定事項）

### 方針：Web先行リリース → 反応が良ければiOS移行

**理由：**
- Apple Developer Program未登録（$99/年）→ 公開段階で初めて必要
- Expoは1コードベースでiOS/Android/Web対応。書き直しなしで後から有効化できる

### Web版で「そのまま動く」もの
- タイマー表示・TODO管理・猫アニメーション・きろく・せってい
- AsyncStorage永続化（localStorageとして動作）

### Web版の制約

| 機能 | Web | ネイティブ |
|---|---|---|
| バックグラウンドタイマー | ⚠️ タブが裏に回ると精度低下 | ✅ AppState+通知で完全動作 |
| プッシュ通知 | ⚠️ ブラウザ依存（Safari制限あり） | ✅ フル対応 |
| ウィジェット | ❌ 不可 | ✅ |
| 環境音（expo-av） | ✅ ブラウザAudioAPI経由で動作 | ✅ |

### 技術的な重要メモ

```javascript
// metro.config.js — Web動作に必須の設定
config.resolver.unstable_enablePackageExports = false;
// ↑ これがないとzustandのESMビルド(import.meta含む)がバンドルされてSyntaxError
```

### 移行ステップ（将来）
1. Webで公開（Vercel/Netlify等の無料枠）
2. 手応えがあればApple Developer Program登録
3. EAS BuildでiOSビルド → TestFlight → App Store公開
