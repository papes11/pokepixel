import type { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/state/store";
import GlobalStyles from "../src/styles/GlobalStyles";
import WalletContextProvider from "../src/wallets/wallet-provider";
import "../src/App.css";
import "../src/components/gameboy.css";
import "../public/styles/css-pokemon-gameboy.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  // Minimal polyfills formerly in CRA's src/index.tsx
  if (typeof window !== "undefined") {
    // Type-safe Buffer polyfill for Solana libs
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (window as any).Buffer = (window as any).Buffer || require("buffer").Buffer;
  }
  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <Component {...pageProps} />
      </Provider>
    </WalletContextProvider>
  );
}


