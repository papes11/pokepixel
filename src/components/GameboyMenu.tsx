import styled, { keyframes, css } from "styled-components";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

import nintendo from "../assets/title-screen/solana1.png";
import { useDispatch, useSelector } from "react-redux";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { hideGameboyMenu, selectGameboyMenu } from "../state/uiSlice";
import PixelImage from "../styles/PixelImage";

// Define the SPL token mint address that users need to hold (replace with actual token address)
const REQUIRED_TOKEN_MINT_ADDRESS = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"; // Example token address
const REQUIRED_TOKEN_AMOUNT = 1000; // 1000 tokens required

const StyledGameboyMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const colorAnimation = keyframes`
  0% {
    color: #ffd759;
    background-position: -100vw;
    opacity: 0;
  }
  11.7% {
    opacity: 0;
  }
  12% {
    color: #ffd759;
    background-position: -100vw;
    opacity: 1;
  }
  19.5% {
    color: #ffd759;
  }
  21% {
    color: #ff6740;
  }
  28.5% {
    color: #ff6740;
  }
  30% {
    color: #ffb5fe;
  }
  37.5% {
    color: #ffb5fe;
  }
  39% {
    color: #3cb944;
  }
  46.5% {
    color: #3cb944;
  }
  48% {
    color: #3493f8;
  }
  54% {
    background-position: 100vw;
  }
  100% {
    background-position: 100vw;
    opacity: 1;
  }
`;

const Text = styled.div`
  margin-top: 13%;
  font-family: "PressStart2P", sans-serif;
  font-size: 9rem;
  font-weight: 700;
  font-style: italic;
  text-align: center;
  opacity: 0;
  width: 300vw;
  transform: skew(-5deg);
  overflow: hidden;
  white-space: nowrap;
  color: #3232fc;
  background: -webkit-linear-gradient(
    0deg,
    #3493f8 40%,
    #3cb944 40%,
    #3cb944 45%,
    #ffb5fe 45%,
    #ffb5fe 50%,
    #ff6740 50%,
    #ff6740 55%,
    #ffd759 55%,
    #ffd759 60%,
    var(--bg) 60%
  );
  background-position: -100vw;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${colorAnimation} 3s 1 linear forwards;
  animation: ${colorAnimation} 3s 1 linear forwards;

  @media (max-width: 1000px) {
    font-size: 2.5rem;
  }
`;

const apearIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Nintendo = styled(PixelImage)`
  height: 8%;
  opacity: 100%;

  animation: ${apearIn} 0s 300ms 1 linear forwards;
`;

// New blue-red flash animation
const blueRedFlash = keyframes`
  0% {
    color: #3493f8; /* Blue */
  }
  50% {
    color: #ff3b3b; /* Red */
  }
  100% {
    color: #3493f8; /* Blue */
  }
`;

const ConnectHint = styled.div<{ $error?: boolean }>`
  margin-top: 8px;
  font-family: "PressStart2P", sans-serif;
  font-size: 0.9rem;
  text-align: center;
  color: #3493f8; /* Start with blue */
  cursor: pointer;
  user-select: none;
  opacity: 0;
  animation: 
    ${apearIn} 0s 300ms 1 linear forwards,
    ${blueRedFlash} 1s infinite;

  ${props => props.$error && css`
    animation: 
      ${apearIn} 0s 300ms 1 linear forwards,
      ${blueRedFlash} 0.5s infinite;
  `}

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 1000px) {
    font-size: 0.8rem;
  }
`;

const TokenCheckMessage = styled.div`
  margin-top: 8px;
  font-family: "PressStart2P", sans-serif;
  font-size: 0.7rem;
  text-align: center;
  color:red;
  opacity: 0;
  animation: ${apearIn} 0s 300ms 1 linear forwards;

  @media (max-width: 1000px) {
    font-size: 0.6rem;
  }
`;

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
      if (accountMintAddress === REQUIRED_TOKEN_MINT_ADDRESS && 
          tokenInfo.amount >= BigInt(REQUIRED_TOKEN_AMOUNT * 1000000)) { // Assuming 6 decimals
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking SPL token balance:", error);
    return false;
  }
};

const GameboyMenu = () => {
  const dispatch = useDispatch();
  const show = useSelector(selectGameboyMenu);
  const { connected, publicKey } = useWallet();
  const [flashError, setFlashError] = React.useState(false);
  const [hasRequiredTokens, setHasRequiredTokens] = useState(false);
  const [checkingTokens, setCheckingTokens] = useState(false);

  // Check token balance when wallet is connected
  useEffect(() => {
    const checkTokens = async () => {
      if (connected && publicKey) {
        setCheckingTokens(true);
        try {
          const hasTokens = await checkTokenBalance(publicKey);
          setHasRequiredTokens(hasTokens);
        } catch (error) {
          console.error("Error checking token balance:", error);
          setHasRequiredTokens(false);
        } finally {
          setCheckingTokens(false);
        }
      } else {
        setHasRequiredTokens(false);
      }
    };

    checkTokens();
  }, [connected, publicKey]);

  useEvent(Event.A, () => {
    if (connected && hasRequiredTokens) {
      dispatch(hideGameboyMenu());
    } else {
      setFlashError(true);
      window.setTimeout(() => setFlashError(false), 1500);
    }
  });

  if (!show) return null;

  return (
    <StyledGameboyMenu>
      <Text>SOLBOY</Text>
      <Nintendo src={nintendo} />
      {!connected && (
        <ConnectHint $error={flashError} onClick={() => {
          setFlashError(true);
          window.setTimeout(() => setFlashError(false), 1500);
        }} role="button" aria-label="Connect wallet to play">
          Connect wallet to play
        </ConnectHint>
      )}
      {connected && !checkingTokens && !hasRequiredTokens && (
        <TokenCheckMessage>
          Hold 1k $pokepixel to play
        </TokenCheckMessage>
      )}
      {connected && checkingTokens && (
        <TokenCheckMessage>
          Checking token balance...
        </TokenCheckMessage>
      )}
    </StyledGameboyMenu>
  );
};

export default GameboyMenu;