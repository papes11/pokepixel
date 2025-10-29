import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Gameboy from '../src/components/Gameboy';
import GlobalStyles from '../src/styles/GlobalStyles';
import WalletContextProvider from '../src/wallets/wallet-provider';
import { Provider } from 'react-redux';
import { store } from '../src/state/store';

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

const flicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.4; }
`;

const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 4px #ff6600, 0 0 8px #ff3300; }
  50% { text-shadow: 0 0 8px #ffaa00, 0 0 16px #ff6600; }
`;

const LaunchScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(10, 10, 8);
  font-family: 'Press Start 2P', monospace;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const Ghost = styled.div<{ top: number; left: number; duration: number }>`
  position: absolute;
  font-size: 26px;
  opacity: 0.8;
  color: #8fffcf;
  text-shadow: 0 0 10px #8fffcf, 0 0 20px #00ffaa;
  animation: ${({ duration }) => moveGhost(duration)} ${({ duration }) => duration}s linear infinite;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
`;

const moveGhost = (duration: number) => keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.9; }
  25% { transform: translate(${rand()}px, ${rand()}px) rotate(${rand(-15,15)}deg); opacity: 0.7; }
  50% { transform: translate(${rand()}px, ${rand()}px) rotate(${rand(-15,15)}deg); opacity: 0.8; }
  75% { transform: translate(${rand()}px, ${rand()}px) rotate(${rand(-15,15)}deg); opacity: 0.6; }
  100% { transform: translate(0, 0) rotate(0deg); opacity: 0.9; }
`;

function rand(min = -50, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const LaunchText = styled.div`
  color: #ff6600;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.8;
  margin-bottom: 10px;
  text-shadow: 0 0 6px #ff3300, 0 0 12px #ff6600;
  animation: ${flicker} 2.5s infinite, ${glowPulse} 3s infinite;
  z-index: 2;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const AnimatedDots = styled.span`
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  animation: blink 1.5s infinite;
`;

const LAUNCH_TIME = new Date('2025-9-21T13:00:00Z').getTime();

export default function LaunchPage() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [ghosts, setGhosts] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random ghosts positions
    const newGhosts = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      duration: Math.random() * 6 + 6, // 6–12 seconds
    }));
    setGhosts(newGhosts);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = LAUNCH_TIME - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const timerId = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            <LaunchScreen>
              {/* 👻 Randomly moving ghosts */}
              {ghosts.map((ghost) => (
                <Ghost
                  key={ghost.id}
                  top={ghost.top}
                  left={ghost.left}
                  duration={ghost.duration}
                >
                  👻
                </Ghost>
              ))}

              <LaunchText>
                ALPHANET<br />
                IS LIVE<AnimatedDots>...</AnimatedDots>
              </LaunchText>

              <LaunchText style={{ fontSize: '12px', marginTop: '30px', color: '#ffcc00' }}>
                LAUNCHING SOON!<br />
                🎃 HAPPY HALLOWEEN 🎃
              </LaunchText>
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}
