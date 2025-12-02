import styled, { keyframes, css } from "styled-components";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

import nintendo from "../../public/log.png";
import { useDispatch, useSelector } from "react-redux";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { hideGameboyMenu, selectGameboyMenu } from "../state/uiSlice";
import PixelImage from "../styles/PixelImage";
import SPL from "./SPL";
import { REQUIRED_GAME_TOKEN_MINT_ADDRESS, REQUIRED_GAME_TOKEN_AMOUNT } from "../app/constants";



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
  height: 100%;
  position: absolute;
  opacity: 100%;

  animation: ${apearIn} 0s 300ms 1 linear forwards;
`;

// New loading animation keyframes
const loadingPulse = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`;

// Loading bar keyframes
const loadingBarFill = keyframes`
  0% {
    width: 30%;
  }
  100% {
    width: 100%;
  }
`;

// Loading effect styled component
const LoadingText = styled.div`
  margin-top: 120px;
  font-family: "PressStart2P", sans-serif;
  font-size: 0.8rem;
  text-align: center;
  color: #3493f8;
  opacity: 0;
  animation: ${apearIn} 0s 600ms 1 linear forwards, ${loadingPulse} 1.5s infinite;

  @media (max-width: 1000px) {
    font-size: 0.6rem;
  }
`;

// Prompt text when loading is complete
const PromptText = styled.div`
  margin-top: 120px;
  font-family: "PressStart2P", sans-serif;
  font-size: 0.8rem;
  text-align: center;
  color: #3cb944; // Green color for success
  opacity: 0;
  animation: ${apearIn} 0s 600ms 1 linear forwards;

  @media (max-width: 1000px) {
    font-size: 0.6rem;
  }
`;

// Loading bar container
const LoadingBarContainer = styled.div`
  width: 80%;
  height: 10px;
  background-color: #111;
  border: 2px solid #333;
  border-radius: 5px;
  margin: 15px auto 0;
  overflow: hidden;
  opacity: 0;
  animation: ${apearIn} 0s 600ms 1 linear forwards;
`;

// Loading bar fill
const LoadingBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3493f8, #ff6740);
  width: 30%;
  animation: ${loadingBarFill} 10s ease-in-out forwards;
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
  margin-top: 100px;
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

const ToggleButton = styled.button`
  margin-top: 15px;
  padding: 8px 16px;
  font-family: "PressStart2P", sans-serif;
  font-size: 0.6rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
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

const GameboyMenu = () => {
  const dispatch = useDispatch();
  const show = useSelector(selectGameboyMenu);
  const { connected, publicKey } = useWallet();
  const [flashError, setFlashError] = React.useState(false);
  const [hasRequiredTokens, setHasRequiredTokens] = useState(true); // Default to true to bypass token check
  const [bypassMode, setBypassMode] = useState(true); // Toggle state for bypass mode
  const [loadingComplete, setLoadingComplete] = useState(false); // Track if loading is complete

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && loadingComplete) {
        dispatch(hideGameboyMenu());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [loadingComplete, dispatch]);

  // Set loading complete after 10 seconds
  useEffect(() => {
    if (connected) {
      const timer = setTimeout(() => {
        setLoadingComplete(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [connected]);

  useEvent(Event.A, () => {
    // Only allow playing if loading is complete and user has required tokens
    if (connected && loadingComplete && (bypassMode || hasRequiredTokens)) {
      dispatch(hideGameboyMenu());
    } else if (!loadingComplete) {
      // Flash error if trying to enter before loading is complete
      setFlashError(true);
      window.setTimeout(() => setFlashError(false), 1500);
    } else {
      // Flash error for other issues (token check, etc.)
      setFlashError(true);
      window.setTimeout(() => setFlashError(false), 1500);
    }
  });

  useEvent(Event.Start, () => {
    // Only allow playing if loading is complete and user has required tokens
    if (connected && loadingComplete && (bypassMode || hasRequiredTokens)) {
      dispatch(hideGameboyMenu());
    } else if (!loadingComplete) {
      // Flash error if trying to enter before loading is complete
      setFlashError(true);
      window.setTimeout(() => setFlashError(false), 1500);
    } else {
      // Flash error for other issues (token check, etc.)
      setFlashError(true);
      window.setTimeout(() => setFlashError(false), 1500);
    }
  });

  if (!show) return null;

  return (
    <StyledGameboyMenu>
      {/* <Text>SOLBOY</Text> */}
      <Nintendo src={nintendo} />
      {/* Show loading effect when wallet is connected */}
      {connected && (
        <>
          {loadingComplete ? (
            <PromptText>Press ENTER to Enter Game</PromptText>
          ) : (
            <LoadingText>Loading Game...</LoadingText>
          )}
          <LoadingBarContainer>
            <LoadingBarFill />
          </LoadingBarContainer>
        </>
      )}
      <SPL onTokenCheckComplete={setHasRequiredTokens} bypassMode={bypassMode} />
      {!connected && (
        <ConnectHint $error={flashError} onClick={() => {
          setFlashError(true);
          window.setTimeout(() => setFlashError(false), 1500);
        }} role="button" aria-label="Connect wallet to play">
          Connect wallet to play
        </ConnectHint>
      )}
      
      
      
      
      {/* Show token check message only when not in bypass mode and wallet is connected but user doesn't have tokens */}
      {connected && !hasRequiredTokens && !bypassMode && (
        <TokenCheckMessage>
          ⚠️ Wallet not on Access list?
        </TokenCheckMessage>
      )}
    </StyledGameboyMenu>
  );
};

export default GameboyMenu; 