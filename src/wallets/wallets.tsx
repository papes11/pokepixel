import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Power } from "lucide-react";

const CustomConnectButton = () => {
  const { wallet, connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnectClick = () => {
    if (!connected) {
      setVisible(true);
    }
  };

  const handleDisconnectClick = () => {
    disconnect();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}..${address.slice(-4)}`;
  };

  return (
    <div style={{ width: '100%' }}>
      {connected && publicKey ? (
        <button
          onClick={handleDisconnectClick}
          className="wallet-button-connected"
          style={{
            background: "linear-gradient(180deg, #C0C0C0 0%, #A9A9A9 30%, #808080 60%, #696969 100%)",
            color: "#000000",
            textShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
            border: "5px solid #696969",
            borderBottom: "2px solid #333333",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.8), 0px 4px 12px rgba(0, 0, 0, 0.5), inset 0px 3px 10px rgba(255, 255, 255, 0.1), inset 0px -3px 10px rgba(0, 0, 0, 0.7)",
            fontWeight: "bold",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "55px",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.15s ease-out",
            letterSpacing: "1.5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0",
            fontFamily: "inherit",
            lineHeight: "42px",
            width: "100%",
            height: "42px"
          }}
        >
          <span>{shortenAddress(publicKey.toBase58())}</span>
          <Power size={18} />
        </button>
      ) : (
        <button
          onClick={handleConnectClick}
          className="wallet-button-disconnected"
          style={{
            background: "linear-gradient(180deg, #C0C0C0 0%, #A9A9A9 30%, #808080 60%, #696969 100%)",
            color: "#000000",
            textShadow: "0px 0px 12px rgba(255, 255, 255, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.8)",
            border: "5px solid #696969",
            borderBottom: "2px solid #333333",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.8), 0px 4px 12px rgba(0, 0, 0, 0.5), inset 0px 3px 10px rgba(255, 255, 255, 0.1), inset 0px -3px 10px rgba(0, 0, 0, 0.7)",
            fontWeight: "bold",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "55px",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.15s ease-out",
            letterSpacing: "1.5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0",
            fontFamily: "inherit",
            lineHeight: "42px",
            width: "100%",
            height: "42px"
          }}
        >
          CONNECT WALLET
        </button>
      )}
    </div>
  );
};

export default CustomConnectButton;