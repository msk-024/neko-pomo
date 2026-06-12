# 🐱 ねこポモ

猫と一緒にポモドーロ × TODO管理アプリ。集中中は猫が静かに隣にいて、サボると睨まれる。かわいくて機能的。

---

## ✨ 機能

- 🍅 **ポモドーロタイマー** — 集中・休憩・長休憩の3モード。バックグラウンドでも正確に動作
- ✅ **やることリスト** — 完了済みタスクは削除可能。毎日自動リセット
- 🐾 **猫の状態アニメーション** — 集中中・休憩中・サボり中…で猫の表情が変わる
- 📊 **きろく画面** — ポモ数・集中時間・連続日数・週間バーチャート・35日カレンダー
- 🎨 **猫の毛色選択** — 茶トラ・黒猫・三毛猫の3種類
- 🌅 **時間帯連動背景** — 朝・昼・夜で背景が自動で切り替わる
- 📱 **PWA対応** — ブラウザからホーム画面に追加可能

---

## 🛠 技術スタック

| 役割 | 技術 |
|------|------|
| フレームワーク | Expo SDK 54 / React Native 0.81 |
| 言語 | TypeScript (strict mode) |
| ナビゲーション | expo-router v6 |
| 状態管理 | Zustand v5 + AsyncStorage |
| アニメーション | react-native-reanimated v4 |
| デプロイ | Vercel (static export) |

---

## 🚀 ローカルで動かす

```bash
git clone https://github.com/msk-024/neko-pomo.git
cd neko-pomo
npm install
npx expo start
```

- ブラウザで開く → ターミナルで `w` キーを押す
- 実機で確認 → [Expo Go](https://expo.dev/go) アプリでQRコードをスキャン

---

## 📱 デモ

> 🚧 デプロイURL準備中

---

## 📁 ディレクトリ構成

```
neko-pomo/
├── app/              # expo-router ページ（タブ・オンボーディング）
├── components/       # 猫・タイマー・TODOの再利用コンポーネント
├── stores/           # Zustand ストア（5種類）
├── hooks/            # カスタムフック
├── constants/        # カラー・猫画像・背景画像のマッピング
├── utils/            # AsyncStorage・時刻ユーティリティ
└── assets/images/    # 猫画像(WebP×18枚)・背景画像(WebP×3枚)
```

---

## 🙏 作者

[@msk-024](https://github.com/msk-024)
