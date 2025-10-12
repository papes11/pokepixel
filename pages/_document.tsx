import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Pokepixel" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pokepixel" />
        <meta name="description" content="Play Pokepixel, the blockchain Pokepixel on Solana. Collect NFTs, earn SOL, and explore the world!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#d0d3d4" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#d0d3d4" />

        {/* Apple Icons */}
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/logo192.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo192.png" />
        
        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}