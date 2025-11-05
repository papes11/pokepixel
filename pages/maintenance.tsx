import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Gameboy from "../src/components/Gameboy";
import GlobalStyles from "../src/styles/GlobalStyles";
import WalletContextProvider from "../src/wallets/wallet-provider";
import { Provider } from "react-redux";
import { store } from "../src/state/store";

// Add prop type definition
interface LaunchPageProps {
  onLaunch?: () => void;
}

const StyledApp = styled.div`
  background: black;
  width: 100vw;
  height: 100dvh;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  padding-bottom: 25px;

  @media (min-width: 1000px) {
    padding: 5px;
  }
`;

const LaunchScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(10, 10, 8);
  font-family: "Press Start 2P", monospace;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const LaunchText = styled.div`
  color: #0f380f;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.8;
  text-shadow: 2px 2px 0px #8bac0f;
  margin-bottom: 10px;
  font-family: monospace;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export default function LaunchPage({ onLaunch }: LaunchPageProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    // Set a fixed global target time that all users will count down to
    // Change this to whatever fixed time you want (example: November 5, 2025 at 12:00 UTC)
    const target = new Date('2025-11-05T14:30:00Z');

    const updateCountdown = () => {
      const current = new Date();
      const diff = target.getTime() - current.getTime();

      if (diff <= 0) {
        setLaunched(true);
        setTimeLeft("00:00:00");
        // Call onLaunch callback if provided
        if (onLaunch) {
          onLaunch();
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Format time display
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [onLaunch]);

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            <LaunchScreen>
              {!launched ? (
                <>
                  <LaunchText>Launching In</LaunchText>
                  <LaunchText style={{ fontSize: "16px", marginTop: "20px" }}>
                    {timeLeft}
                  </LaunchText>
                </>
              ) : (
                <LaunchText>🚀 Launching Now!</LaunchText>
              )}
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}
