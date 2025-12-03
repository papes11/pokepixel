import React, { useState, useEffect } from "react";
import WalletContextProvider from "../../src/wallets/wallet-provider";
import { Provider } from "react-redux";
import { store } from "../../src/state/store";
import CustomConnectButton from "../../src/wallets/wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import "./SwapPage.css";

// Specific address to check transactions against
const TARGET_ADDRESS = "DDQYa2KKK9QYH2GkaYt95cjqpst9w6emHoms6r7Wetp7";

// Function to check if wallet has made transactions to specific address
async function checkTransactionsToAddress(connection: Connection, publicKey: PublicKey) {
  try {
    // Fetch recent transactions for the wallet
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 100 });
    
    let transactionCount = 0;
    
    // Check each transaction
    for (const signatureInfo of signatures) {
      try {
        // Get transaction details
        const tx = await connection.getTransaction(signatureInfo.signature, {
          maxSupportedTransactionVersion: 0
        });
        
        if (!tx) continue;
        
        // Check if transaction was successful
        if (tx.meta?.err) continue;
        
        // Check if transaction involves our target address
        const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;
        const targetInTransaction = accountKeys.some(key => key.toBase58() === TARGET_ADDRESS);
        
        if (targetInTransaction) {
          transactionCount += 1;
        }
      } catch (txError) {
        // Skip this transaction if we can't process it
        continue;
      }
    }
    
    return transactionCount;
  } catch (error) {
    console.error("Error checking transactions:", error);
    return 0;
  }
}

// Function to calculate SOL to receive based on box count
function calculateSolToReceive(boxCount: number) {
  // Based on documentation:
  // Silver Box = 0.1 SOL
  // For simplicity, let's assume all boxes are Silver (0.1 SOL each)
  return boxCount * 0.001;
}

const SwapContent = () => {
  const { connected, publicKey } = useWallet();
  const [transactionCount, setTransactionCount] = useState(0);
  const [solToReceive, setSolToReceive] = useState(0);
  const [boxesToSwap, setBoxesToSwap] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSwapPopup, setShowSwapPopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  
  // Handle wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      // Show loading popup when wallet connects
      setShowLoadingPopup(true);
      fetchTransactionData();
    }
  }, [connected, publicKey]);
  
  const fetchTransactionData = async () => {
    if (!connected || !publicKey) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Create connection to Solana
      const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=fb1251b4-9828-40cb-a869-09bc2a7a9ee5");
      
      // Check transactions to specific address
      const count = await checkTransactionsToAddress(connection, publicKey);
      setTransactionCount(count);
      setBoxesToSwap(count); // Set default swap amount to total boxes
      
      // Calculate SOL to receive
      const solAmount = calculateSolToReceive(count);
      setSolToReceive(solAmount);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
      setError("Failed to fetch transaction data. Please try again.");
    } finally {
      setLoading(false);
      // Close loading popup when done
      setShowLoadingPopup(false);
    }
  };
  
  // Handle input change for boxes to swap
  const handleBoxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBoxesToSwap(value);
    
    // Recalculate SOL to receive
    const solAmount = calculateSolToReceive(value);
    setSolToReceive(solAmount);
  };
  
  const handleSwapClick = () => {
    if (connected && boxesToSwap > 0) {
      setShowSwapPopup(true);
    }
  };
  
  const closePopup = () => {
    setShowSwapPopup(false);
  };
  
  return (
    <>
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
            <div className="balance">Treasure Loot: {transactionCount}</div>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="swap-row">
            <div className="asset">
              <button className="asset-btn">Box</button>
              <div className="asset-sub">you send</div>
            </div>
            <input 
              className="amount" 
              value={boxesToSwap} 
              onChange={handleBoxesChange}
              aria-label="Boxes to swap" 
            />
          </div>

          <div className="swap-row">
            <div className="asset">
              <button className="asset-btn">Sol</button>
              <div className="asset-sub">you receive</div>
            </div>
            <input 
              className="amount" 
              value={solToReceive.toFixed(4)} 
              readOnly
              aria-label="SOL to receive" 
            />
          </div>
          
          <div className="route-row">
            <span className="flash">⚡</span>
            <span className="route-tag">OPTIMISED+</span>
            <span className="route-tag alt">RTSE+</span>
          </div>

          <button className="swap-action" onClick={handleSwapClick} disabled={!connected || boxesToSwap <= 0 || loading}>
            {connected ? (boxesToSwap > 0 ? "SWAP" : "No loot Found") : "Connect Wallet"}
          </button>
        </section>
      </main>
      
      {/* Loading Popup - shows when wallet connects and checking transactions */}
      {showLoadingPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="loading-message">
              Checking box loot on blockchain...
            </div>
          </div>
        </div>
      )}
      
      {/* Swap Information Popup */}
      {showSwapPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Swap Feature Coming Soon</h2>
            <div className="swap-details">
              <div className="swap-item">
                <span>{boxesToSwap} Treasure Box(es)</span>
              </div>
              <div className="swap-arrow">→</div>
              <div className="swap-item">
                <span>{solToReceive.toFixed(4)} SOL</span>
              </div>
            </div>
            <p className="popup-message">
              The swap feature will be unlocked in Supernet. 
              Please check back later for updates on when this feature becomes available.
            </p>
            <div className="popup-actions">
              <button className="popup-button confirm" onClick={closePopup}>
                OKAY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function SwapPage() {
  return (
    <WalletContextProvider>
      <Provider store={store}>
        <div className="swap-root">
          <SwapContent />
          
          <footer className="swap-footer">
            <div className="footer-container">
              <div className="socials">
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X/Twitter">
                  X
                </a>
                <a href="https://telegram.com" target="_blank" rel="noreferrer" aria-label="Discord">
                  Telegram
                </a>
                {/* <a href="https://pump.fun/coin/6XV9E6HgVwkdyzfnES4DVDjgAsKfPeNgKwYgYBumpump" target="_blank" rel="noreferrer" aria-label="GitHub">
                  pumpfun
                </a> */}
              </div>
              <span>© {new Date().getFullYear()} Pokepixel. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </Provider>
    </WalletContextProvider>
  );
}