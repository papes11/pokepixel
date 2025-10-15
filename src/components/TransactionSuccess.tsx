import React from "react";
import styled from "styled-components";
import Frame from "./Frame";
import { useDispatch } from "react-redux";
import { hideTransactionSuccess } from "../state/uiSlice";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 100;

  @media (max-width: 1000px) {
    height: 30%;
  }
`;

const LinkButton = styled.a`
  display: block;
  padding: 1px 0px;
  border: 2px solid #333;
  background-color: rgb(249, 242, 250);
  color: #333;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  margin-top: 0px;
  font-family: Arial, Helvetica, sans-serif;
  word-break: break-all;
  font-variant-numeric: tabular-nums;

  &:hover {
    background-color: #ddd;
  }
`;

const SignatureText = styled.div`
  font-family: monospace;
  font-size: 12px;
  padding: 4px 0;
  word-break: break-all;
  color: #666;
`;

interface TransactionSuccessProps {
  signature: string;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ signature }) => {
  const dispatch = useDispatch();
  const url = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;

  // Check if we're in a wallet embedded browser
  const isInWalletBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('phantom') || userAgent.includes('solflare') || userAgent.includes('trust');
  };

  // Handle explorer link click
  const handleExplorerClick = (e: React.MouseEvent) => {
    // In wallet embedded browsers, we need to handle popups differently
    if (isInWalletBrowser()) {
      e.preventDefault();
      
      // Try to open in a new tab/window
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // If popup blocking prevented opening, show instructions
      if (!newWindow) {
        alert('Please allow popups for this site to view the transaction on Solana Explorer');
        // Fallback: try again without popup restrictions
        window.open(url, '_blank');
      }
    }
  };

  useEvent(Event.A, () => {
    dispatch(hideTransactionSuccess());
  });

  return (
    <Container>
      <Frame wide tall>
        <div>  ⚔️ !Loot acquired! ⚔️</div>
       <div>Added to your Quest Box ✅</div>
       
        <SignatureText>
          {signature.substring(0, 8)}...{signature.substring(signature.length - 8)}
        </SignatureText>

        <LinkButton 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleExplorerClick}
        >
          View on Explorer
        </LinkButton>
      </Frame>
    </Container>
  );
};

export default TransactionSuccess;