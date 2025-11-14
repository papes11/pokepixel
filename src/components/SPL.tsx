import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { REQUIRED_GAME_TOKEN_MINT_ADDRESS, REQUIRED_GAME_TOKEN_AMOUNT } from "../app/constants";

// Function to check if wallet has required SPL token balance
const checkTokenBalance = async (publicKey: any) => {
  try {
    // Use the same RPC endpoint as the rest of the app
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=fb1251b4-9828-40cb-a869-09bc2a7a9ee5");
    
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    // Check each token account to see if it matches our target token
    for (const { account } of tokenAccounts.value) {
      // Convert Buffer to Uint8Array for AccountLayout.decode
      const accountData = new Uint8Array(account.data);
      const tokenInfo = AccountLayout.decode(accountData);
      
      // Convert the mint address to string for comparison
      const accountMintAddress = tokenInfo.mint.toString();
      
      // Check if this account holds tokens from our target contract and has sufficient balance
      // Note: tokenInfo.amount is a BigInt, so we need to compare appropriately
      if (accountMintAddress === REQUIRED_GAME_TOKEN_MINT_ADDRESS && 
          tokenInfo.amount >= BigInt(REQUIRED_GAME_TOKEN_AMOUNT * 1000000)) { // Assuming 6 decimals
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking SPL token balance:", error);
    return false;
  }
};

interface SPLProps {
  onTokenCheckComplete: (hasRequiredTokens: boolean) => void;
  bypassMode?: boolean; // Add bypassMode prop
}

const SPL: React.FC<SPLProps> = ({ onTokenCheckComplete, bypassMode = true }) => {
  const { connected, publicKey } = useWallet();
  const [hasRequiredTokens, setHasRequiredTokens] = useState(true); // Default to true to bypass token check
  const [checkingTokens, setCheckingTokens] = useState(false);

  // Check token balance when wallet is connected or when bypassMode changes
  useEffect(() => {
    const checkTokens = async () => {
      // If bypass mode is enabled, skip token check
      if (bypassMode) {
        setHasRequiredTokens(true);
        onTokenCheckComplete(true);
        return;
      }
      
      // Otherwise, perform actual token check
      if (connected && publicKey) {
        setCheckingTokens(true);
        try {
          const hasTokens = await checkTokenBalance(publicKey);
          setHasRequiredTokens(hasTokens);
          onTokenCheckComplete(hasTokens);
        } catch (error) {
          console.error("Error checking token balance:", error);
          setHasRequiredTokens(false);
          onTokenCheckComplete(false);
        } finally {
          setCheckingTokens(false);
        }
      } else {
        setHasRequiredTokens(false);
        onTokenCheckComplete(false);
      }
    };

    checkTokens();
  }, [connected, publicKey, onTokenCheckComplete, bypassMode]);

  if (!connected) {
    return null;
  }

  if (checkingTokens) {
    return (
      <div style={{ 
        marginTop: '8px',
        fontFamily: '"PressStart2P", sans-serif',
        fontSize: '0.7rem',
        textAlign: 'center',
        color: 'red',
        opacity: 1
      }}>
        Checking token balance...
      </div>
    );
  }

  if (!hasRequiredTokens && !bypassMode) {
    return (
      <div style={{ 
        marginTop: '8px',
        fontFamily: '"PressStart2P", sans-serif',
        fontSize: '0.7rem',
        textAlign: 'center',
        color: 'red',
        opacity: 1
      }}>
        Hold 1k $pokepixel to play
      </div>
    );
  }

  return null;
};

export default SPL;
