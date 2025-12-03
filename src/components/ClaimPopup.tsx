import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { LogOut, Power } from "lucide-react";
import CustomConnectButton from "../wallets/wallets";

interface ClaimPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClaimPopup: React.FC<ClaimPopupProps> = ({ isOpen, onClose }) => {
  const { connected, publicKey, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [hasNFT, setHasNFT] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The contract address for NFT checking
  const CONTRACT_ADDRESS = "BonXccsw4qy1JKtv1Tyj2H8PMkGeXa2LhScT59DYvRgz";

  useEffect(() => {
    if (isOpen && connected && publicKey) {
      checkNFTOwnership();
    }
  }, [isOpen, connected, publicKey]);

  const checkNFTOwnership = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);
    setHasNFT(null);

    try {
      // Create connection to Solana
      const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=fb1251b4-9828-40cb-a869-09bc2a7a9ee5");

      // Check if the wallet has any transactions related to the contract
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 100 });
      
      let foundRelevantTransaction = false;
      
      // Check each transaction to see if it involves our contract
      for (const signatureInfo of signatures) {
        try {
          const tx = await connection.getTransaction(signatureInfo.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          if (!tx) continue;
          
          // Check if transaction was successful
          if (tx.meta?.err) continue;
          
          // Check if transaction involves our target contract
          const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;
          const targetInTransaction = accountKeys.some(key => key.toBase58() === CONTRACT_ADDRESS);
          
          if (targetInTransaction) {
            foundRelevantTransaction = true;
            break;
          }
        } catch (txError) {
          // Skip this transaction if we can't process it
          continue;
        }
      }
      
      setHasNFT(foundRelevantTransaction);
    } catch (err) {
      console.error("Error checking NFT ownership:", err);
      setError("Failed to check NFT ownership. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 2)}..${address.slice(-2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            color: '#c0c0c0',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            margin: 0,
            textAlign: 'center',
            flex: 1
          }}>
            Airdrop Checker
          </h2>
          
          {connected && publicKey && (
            <button 
              onClick={handleDisconnect}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#c0c0c0'
              }}
              title="Disconnect Wallet"
            >
              <LogOut size={20} />
              <span style={{ marginLeft: '8px' }}>{shortenAddress(publicKey.toBase58())}</span>
            </button>
          )}
        </div>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://img-cdn.magiceden.dev/autoquality:none/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fsolana_game_pass_s1%2F91db7ba3-c940-42ba-b557-2371f80d1d3c" 
          alt="Airdrop NFT" 
          style={{ 
            width: '100%', 
            maxHeight: '300px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            marginBottom: '20px'
          }} 
        />
        
        {!connected ? (
          <div className="popup-message">
            <p>Please connect your wallet to check your eligibility for the airdrop.</p>
        <div className="walletconnect">
          <CustomConnectButton />
        </div>
            
          </div>
        ) : isLoading ? (
          <div className="loading-message">
            Checking NFT ownership...
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : hasNFT === true ? (
          <div>
            <div className="info-message">
              Congratulations! You are eligible for the airdrop ~25$ POKEPIXEL
              Follow us @pokepixelsolana for Claim dates!
            </div>
            <p className="popup-message">
              You own SOLANA GAMING PASS. Your wallet address is registered for the airdrop.
            </p>
          </div>
        ) : hasNFT === false ? (
          <div>
            <div className="error-message">
              Not eligible for airdrop
            </div>
            <p className="popup-message">
              You do not own any SOLANA GAMING PASS (Contract: {CONTRACT_ADDRESS}).
            </p>
          </div>
        ) : null}

        <div className="popup-actions">
          <button 
            className="popup-button confirm" 
            onClick={onClose}
            style={{
              background: 'black',
              color: '#c0c0c0',
              border: '1px solid #c0c0c0',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 'bold',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-heading)'
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimPopup;