const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expoのデフォルト設定では unstable_enablePackageExports が true になっており、
// package.json の "exports" マップが優先される。
// zustand 等はこのマップの "import" 条件で import.meta を含むESMビルド
// （esm/*.mjs）を指しており、Web（<script>として読み込む非モジュール環境）では
// 構文エラー（Cannot use 'import.meta' outside a module）になる。
// false にして mainFields 解決へフォールバックさせ、import.metaを含まない
// CJSビルド（index.js）を使わせる。
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
