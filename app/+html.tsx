import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const SITE_URL = 'https://neko-pomo.vercel.app';
const SITE_TITLE = 'ねこポモ';
const SITE_DESCRIPTION = '猫と一緒にポモドーロ×TODOで集中しよう';

/**
 * Web書き出し時のHTMLシェル（全ページ共通の<head>を定義）
 * @postcondition favicon / PWAマニフェスト / OGPタグを含むHTMLを返す
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* ファビコン */}
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />

        {/* iOS ホーム画面に追加 */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_TITLE} />

        {/* PWA（Android ホーム画面に追加） */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF85A1" />

        {/* OGP（SNS・チャットでのリンクプレビュー） */}
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
