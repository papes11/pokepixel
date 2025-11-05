import React from "react";
import WalletContextProvider from "../../src/wallets/wallet-provider";
import { Provider } from "react-redux";
import { store } from "../../src/state/store";
import CustomConnectButton from "../../src/wallets/wallets";
import "./SwapPage.css";

export default function SwapPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <div className="swap-root">
          <nav className="swap-nav">
            <div className="nav-container">
              <div className="brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo512.png" alt="Pokepixel Logo" />
                <span>Pokepixel Swap</span>
                {/* Wallet button styled like in Gameboy component */}
                <div className="walletconnect">
                  <CustomConnectButton />
                </div>
              </div>
            </div>
          </nav>

          <main className="swap-main">
            <section className="swap-panel">
              <div className="swap-header">
                <div className="mode">Instant</div>
                <div className="balance">BOX: 0.0000</div>
              </div>
              <div className="swap-row">
                <div className="asset">
                  <button className="asset-btn">BOX</button>
                  <div className="asset-sub">You pay</div>
                </div>
                <input 
                  className="amount" 
                  placeholder="0.00" 
                  aria-label="Pay amount" 
                />
              </div>

              <div className="swap-divider" aria-hidden>
                <span className="swap-icon">↕</span>
              </div>

              <div className="swap-row">
                <div className="asset">
                  <button className="asset-btn">SOL</button>
                  <div className="asset-sub">You receive</div>
                </div>
                <input 
                  className="amount" 
                  placeholder="0.00" 
                  aria-label="Receive amount" 
                />
              </div>

              <div className="route-row">
                <span className="flash">⚡</span>
                <span className="route-tag">OPTIMISED+</span>
                <span className="route-tag alt">RTSE+</span>
              </div>

              <button className="swap-action">SWAP</button>
            </section>
          </main>

          <footer className="swap-footer">
            <div className="footer-container">
              <div className="socials">
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X/Twitter">
                  X
                </a>
                <a href="https://telegram.com" target="_blank" rel="noreferrer" aria-label="Discord">
                  Telegram
                </a>
                <a href="http://pump.fun/" target="_blank" rel="noreferrer" aria-label="GitHub">
                  pumpfun
                </a>
              </div>
              <span>© {new Date().getFullYear()} Pokepixel. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </Provider>
    </WalletContextProvider>
  );
}