import React, { useState } from "react";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import Gameboy from "../src/components/Gameboy";

const SwapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a08;
  font-family: "Press Start 2P", monospace;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: #8bac0f;
`;

const SwapTitle = styled.h1`
  color: #8bac0f;
  font-size: 18px;
  text-shadow: 2px 2px 0px #000000;
  margin-bottom: 30px;
  
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const SwapCard = styled.div`
  background: #1a1a18;
  border: 3px solid #8bac0f;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
`;

const SwapInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: #0a0a08;
  border: 2px solid #8bac0f;
  color: #8bac0f;
  font-family: "Press Start 2P", monospace;
  font-size: 12px;
  outline: none;
  
  &:focus {
    border-color: #9cdc0e;
  }
`;

const SwapSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: #0a0a08;
  border: 2px solid #8bac0f;
  color: #8bac0f;
  font-family: "Press Start 2P", monospace;
  font-size: 12px;
  outline: none;
  
  option {
    background: #0a0a08;
    color: #8bac0f;
  }
`;

const SwapButton = styled.button`
  background: #8bac0f;
  color: #0a0a08;
  border: none;
  padding: 12px 24px;
  font-family: "Press Start 2P", monospace;
  font-size: 12px;
  cursor: pointer;
  margin: 10px 5px;
  border-radius: 4px;
  
  &:hover {
    background: #9cdc0e;
  }
  
  &:disabled {
    background: #4a5a0f;
    cursor: not-allowed;
  }
`;

const SwapInfo = styled.div`
  background: #1a1a18;
  border: 2px solid #8bac0f;
  border-radius: 8px;
  padding: 15px;
  width: 90%;
  max-width: 500px;
  margin-top: 20px;
  font-size: 10px;
  line-height: 1.6;
`;

const StatusMessage = styled.div<{ success?: boolean; error?: boolean }>`
  margin: 15px 0;
  padding: 10px;
  border-radius: 4px;
  font-size: 10px;
  ${({ success }) => success && `
    background: rgba(139, 172, 15, 0.2);
    border: 1px solid #8bac0f;
  `}
  ${({ error }) => error && `
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid #ff0000;
  `}
`;

const BoxPreview = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  
  img {
    width: 40px;
    height: 40px;
  }
`;

export default function SwapPage() {
  const { publicKey, connected } = useWallet();
  const [boxType, setBoxType] = useState("silver");
  const [toToken, setToToken] = useState("sol");
  const [amount, setAmount] = useState("1");
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const handleSwap = async () => {
    if (!connected) {
      setStatus({ type: "error", message: "Please connect your wallet first!" });
      return;
    }
    
    if (!boxType || !toToken || !amount) {
      setStatus({ type: "error", message: "Please fill all fields!" });
      return;
    }
    
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setStatus({ type: "error", message: "Please enter a valid amount!" });
      return;
    }
    
    // Simulate swap process
    setStatus({ type: "info", message: "Processing box swap..." });
    
    // In a real implementation, this would connect to a Solana program
    // For now, we'll just simulate a successful swap
    setTimeout(() => {
      let tokenName = toToken === "sol" ? "SOL" : "POKE";
      let amountReceived = toToken === "sol" ? (amountNum * 0.1).toFixed(2) : (amountNum * 1000).toString();
      setStatus({ 
        type: "success", 
        message: `Successfully swapped ${amount} ${boxType.charAt(0).toUpperCase() + boxType.slice(1)} Box(es) for ${amountReceived} ${tokenName}!` 
      });
    }, 2000);
  };

  const getBoxImage = (type: string) => {
    // In a real implementation, you would use actual box images
    return "/boxx.png";
  };

  return (
    <Gameboy>
      <SwapContainer>
        <SwapTitle>BOX TO TOKEN SWAP</SwapTitle>
        
        {/* <SwapCard>
          <h2>Swap Boxes for Tokens</h2>
          <p>Exchange your mystery boxes for SOL or Pokepixel tokens</p>
          
          <BoxPreview>
            <img src={getBoxImage(boxType)} alt={`${boxType} box`} />
            <div>→</div>
            <img src={toToken === "sol" ? "/sol-token.png" : "/poke-token.png"} alt={`${toToken} token`} />
          </BoxPreview>
          
          <div style={{ textAlign: "left", margin: "20px 0" }}>
            <label>Box Type:</label>
            <SwapSelect value={boxType} onChange={(e) => setBoxType(e.target.value)}>
              <option value="silver">Silver Box</option>
              <option value="gold">Gold Box</option>
              <option value="diamond">Diamond Box</option>
            </SwapSelect>
            
            <label>Swap To:</label>
            <SwapSelect value={toToken} onChange={(e) => setToToken(e.target.value)}>
              <option value="sol">SOL Tokens</option>
              <option value="poke">Pokepixel Tokens</option>
            </SwapSelect>
            
            <label>Amount:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <SwapInput
                type="number"
                placeholder="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          <SwapButton onClick={handleSwap} disabled={!connected}>
            {connected ? "SWAP BOXES" : "CONNECT WALLET"}
          </SwapButton>
          
          {status && (
            <StatusMessage 
              success={status.type === "success"} 
              error={status.type === "error"}
            >
              {status.message}
            </StatusMessage>
          )}
        </SwapCard> */}
        
        {/* <SwapInfo>
          <h3>Swap Rates (BetaNet v1)</h3>
          <p>• 1 Silver Box = 0.1 SOL or 1000 POKE</p>
          <p>• 1 Gold Box = 0.25 SOL or 2500 POKE</p>
          <p>• 1 Diamond Box = 0.5 SOL or 5000 POKE</p>
          <p>• Low fee transactions</p>
          <p>• Instant processing</p>
          <p>• Secure blockchain-based swaps</p>
        </SwapInfo> */}
      </SwapContainer>
    </Gameboy>
  );
}