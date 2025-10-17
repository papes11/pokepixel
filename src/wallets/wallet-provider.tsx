import { FC, ReactNode, useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;

  // A list of endpoints to rotate through if one fails or rate-limits
  const RPC_ENDPOINTS = [
    "https://mainnet.helius-rpc.com/?api-key=fb1251b4-9828-40cb-a869-09bc2a7a9ee5",
    "https://neat-red-wish.solana-mainnet.quiknode.pro/3b91b098dabb643aa72b4007138eb1775062d9f0",
    "https://solana-mainnet.g.alchemy.com/v2/Umm2LP16pOXNGKVUQl-5b",
    
  ];

  const [endpoint, setEndpoint] = useState(RPC_ENDPOINTS[0]);

  // Try switching RPCs automatically if one starts failing or rate limits
  useEffect(() => {
    const testEndpoints = async () => {
      for (const url of RPC_ENDPOINTS) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getHealth",
            }),
          });
          const data = await response.json();
          if (data.result === "ok") {
            setEndpoint(url);
            // console.log("✅ Using endpoint:", url);
            return;
          }
        } catch {
          // console.warn("❌ Endpoint failed:", url);
        }
      }
      console.error("⚠️ No healthy Solana RPC endpoints found!");
    };
    testEndpoints();
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ 
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000 // Increase timeout to 60 seconds
    }}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect 
        onError={(error) => {
          console.error("Wallet error:", error);
          // Handle specific wallet errors
          if (error?.name === "WalletSendTransactionError") {
            console.error("WalletSendTransactionError occurred:", error.message);
          }
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
