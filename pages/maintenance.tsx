import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const CountdownText = styled.div`
  color: #8bac0f;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  text-shadow: 1px 1px 0px #0f380f;
  margin-top: 20px;
  font-family: 'Press Start 2P', monospace;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const AnimatedDots = styled.span`
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  animation: blink 1.5s infinite;
`;

// Fixed global launch time — UTC for consistency
const LAUNCH_TIME = new Date('2025-9-21T13:00:00Z').getTime();

export default function LaunchPage() {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = LAUNCH_TIME - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (days > 0) {
      return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
    } else if (hours > 0) {
      return `${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
    } else {
      return `${pad(minutes)}m ${pad(remainingSeconds)}s`;
    }
  };

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            <LaunchScreen>
              <LaunchText>
                Alphanet 
                <br />
                is Live
                <AnimatedDots>...</AnimatedDots>
              </LaunchText>
              {/* <CountdownText>
                {formatTime(timeLeft)}
              </CountdownText> */}
              <LaunchText style={{ fontSize: '12px', marginTop: '30px' }}>
                LAUNCHING SOON!
              </LaunchText>
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}
