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
    <div className="wallet-button-container">
      {connected && publicKey ? (
        <button
          onClick={handleDisconnectClick}
          className="wallet-button-connected"
        >
          <span>{shortenAddress(publicKey.toBase58())}</span>
          <Power size={18} />
        </button>
      ) : (
        <button
          onClick={handleConnectClick}
          className="wallet-button-disconnected"
        >
          CONNECT WALLET
        </button>
      )}
    </div>
  );
};

export default CustomConnectButton;