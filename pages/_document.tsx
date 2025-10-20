import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Play Pokepixel, the blockchain Pokepixel on Solana. Collect NFTs, earn SOL, and explore the world!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#d0d3d4" />
        <meta name="devfun-verification" content="verified" />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
