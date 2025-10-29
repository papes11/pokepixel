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

const randomFloat = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 10 - 5}deg);
    opacity: 0.9;
  }
  50% {
    transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) rotate(${Math.random() * 15 - 7.5}deg);
    opacity: 0.7;
  }
  75% {
    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 10 - 5}deg);
    opacity: 0.9;
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.8;
  }
`;

const Ghost = styled.div<{ delay: number; duration: number; size: string; startX: string; startY: string }>`
  position: absolute;
  left: ${({ startX }) => startX};
  top: ${({ startY }) => startY};
  font-size: ${({ size }) => size};
  opacity: 0.8;
  animation: ${randomFloat} ${({ duration }) => duration}s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
  color: #8fffcf;
  text-shadow: 0 0 10px #8fffcf, 0 0 20px #00ffaa;
  will-change: transform;
  z-index: 1;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
    filter: brightness(1.5);
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
  font-family: 'Press Start 2P', monospace;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

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

const CountdownText = styled.div`
  color: #8fffcf;
  font-size: 14px;
  margin-top: 20px;
  text-shadow: 0 0 5px #8fffcf;
  z-index: 2;
`;

const GhostCounter = styled.div`
  color: #ffcc00;
  font-size: 12px;
  margin-top: 10px;
  text-shadow: 0 0 5px #ffcc00;
  z-index: 2;
`;

const LAUNCH_TIME = new Date('2025-9-21T13:00:00Z').getTime();

// Generate random starting positions
const generateRandomPosition = () => ({
  x: `${Math.random() * 80 + 10}%`,
  y: `${Math.random() * 60 + 20}%`
});

export default function LaunchPage() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [ghostClicks, setGhostClicks] = useState(0);
  const [ghostPositions, setGhostPositions] = useState([
    { x: '15%', y: '25%' },
    { x: '50%', y: '65%' },
    { x: '75%', y: '35%' },
    { x: '25%', y: '75%' },
    { x: '85%', y: '15%' }
  ]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = LAUNCH_TIME - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const timerId = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    // Reposition ghosts every 15 seconds for variety
    const repositionInterval = setInterval(() => {
      setGhostPositions([
        generateRandomPosition(),
        generateRandomPosition(),
        generateRandomPosition(),
        generateRandomPosition(),
        generateRandomPosition()
      ]);
    }, 15000);

    return () => {
      clearInterval(timerId);
      clearInterval(repositionInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleGhostClick = () => {
    setGhostClicks(prev => prev + 1);
  };

  const ghosts = [
    { delay: 0, duration: 8, size: '28px', ...ghostPositions[0] },
    { delay: 1.5, duration: 10, size: '22px', ...ghostPositions[1] },
    { delay: 3, duration: 12, size: '26px', ...ghostPositions[2] },
    { delay: 2, duration: 9, size: '20px', ...ghostPositions[3] },
    { delay: 4, duration: 11, size: '24px', ...ghostPositions[4] }
  ];

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            <LaunchScreen>
              {/* 👻 Randomly moving ghost effects */}
              {ghosts.map((ghost, index) => (
                <Ghost
                  key={index}
                  delay={ghost.delay}
                  duration={ghost.duration}
                  size={ghost.size}
                  startX={ghost.x}
                  startY={ghost.y}
                  onClick={handleGhostClick}
                  title="Click me! 👻"
                >
                  👻
                </Ghost>
              ))}

              {/* Main text */}
              <LaunchText>
                ALPHANET<br />
                IS LIVE<AnimatedDots>...</AnimatedDots>
              </LaunchText>

              {/* Halloween message */}
              <LaunchText style={{ fontSize: '12px', marginTop: '30px', color: '#ffcc00' }}>
                ON Maintenance!<br />
                🎃 HAPPY HALLOWEEN 🎃
              </LaunchText>

              {/* Countdown timer */}
              {timeLeft > 0 && (
                <CountdownText>
                  LAUNCHING IN:<br />
                  {formatTime(timeLeft)}
                </CountdownText>
              )}

              {/* Ghost counter */}
              <GhostCounter>
                GHOSTS CLICKED: {ghostClicks}
              </GhostCounter>

              {/* Hidden message for clicking ghosts */}
              {ghostClicks >= 10 && (
                <LaunchText style={{ fontSize: '10px', marginTop: '10px', color: '#8fffcf' }}>
                  BOO! YOU FOUND THE SECRET! 🎃
                </LaunchText>
              )}
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}