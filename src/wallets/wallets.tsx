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
    <div>
      {connected && publicKey ? (
        <button
        onClick={handleDisconnectClick}
        className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        style={{ gap: '8px' }}
      >
        <span>{shortenAddress(publicKey.toBase58())}</span>
        <Power size={18} />
      </button>
      ) : (
        <button
          onClick={handleConnectClick}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default CustomConnectButton;