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

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '50px',
    fontWeight: 'bold',
    fontSize: '8px',
    textAlign: 'center',
    borderRadius: '60px',
    background: connected 
      ? 'linear-gradient(180deg, #E55555 0%, #C83232 50%, #A02020 100%)'
      : 'linear-gradient(180deg, #1E4A5F 0%, #163A4A 50%, #0F2A35 100%)',
    border: '3px solid #0A1F2E',
    borderBottom: '5px solid #000',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.6), inset 0px 2px 6px rgba(255, 255, 255, 0.1), inset 0px -2px 6px rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease-out',
    letterSpacing: '2px',
    color: connected ? '#FFFFFF' : '#00E5FF',
    textShadow: connected ? '0px 0px 8px rgba(255, 255, 255, 0.3)' : '0px 0px 10px rgba(0, 229, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0',
    lineHeight: 'normal',
  };

  const activeStyle: React.CSSProperties = {
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.7), inset 0px 4px 12px rgba(0, 0, 0, 0.8)',
    borderBottomWidth: '2px',
  };

  return (
    <div style={{ width: '100%' }}>
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
          style={buttonStyle}
          onMouseDown={(e) => Object.assign(e.currentTarget.style, activeStyle)}
          onMouseUp={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          onTouchStart={(e) => Object.assign(e.currentTarget.style, activeStyle)}
          onTouchEnd={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          CONNECT WALLET
        </button>
      )}
    </div>
  );
};

export default CustomConnectButton;