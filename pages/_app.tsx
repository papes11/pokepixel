import type { AppProps } from "next/app";
import React from "react";
import { Buffer } from "buffer";
import { Provider } from "react-redux";
import { store } from "../src/state/store";
import GlobalStyles from "../src/styles/GlobalStyles";
import WalletContextProvider from "../src/wallets/wallet-provider";
import "../src/App.css";
import "../public/styles/css-pokepixel-gameboy.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  // Minimal polyfills formerly in CRA's src/index.tsx
  if (typeof window !== "undefined") {
    // Type-safe Buffer polyfill for Solana libs
    (window as any).Buffer = (window as any).Buffer || Buffer;
    // Disable vibration/haptics globally
    try {
      const nav: any = navigator as any;
      if (nav && typeof nav.vibrate === "function") {
        nav.vibrate = () => false;
      }
    } catch {}
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


