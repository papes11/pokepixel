import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Gameboy from "../src/components/Gameboy";
import GlobalStyles from "../src/styles/GlobalStyles";
import WalletContextProvider from "../src/wallets/wallet-provider";
import { Provider } from "react-redux";
import { store } from "../src/state/store";

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

const AnimatedDots = styled.span`
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  animation: blink 1.5s infinite;
`;

/* === Floating Elements === */
const float = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0.6;
  }
  25% {
    transform: translate(10px, -20px);
    opacity: 1;
  }
  50% {
    transform: translate(-10px, -40px);
    opacity: 0.8;
  }
  75% {
    transform: translate(15px, -20px);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.6;
  }
`;

const FloatingElement = styled.div<{ top: number; left: number; delay: number; size: number }>`
  position: absolute;
  top: ${(p) => p.top}%;
  left: ${(p) => p.left}%;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  background: radial-gradient(circle at 50% 50%, #8bac0f 40%, transparent 70%);
  border-radius: 50%;
  animation: ${float} 5s ease-in-out infinite;
  animation-delay: ${(p) => p.delay}s;
  box-shadow: 0 0 10px #8bac0f, 0 0 20px #8bac0f;
  opacity: 0.8;
`;

export default function LaunchPage() {
  const [elements, setElements] = useState<
    { top: number; left: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 5 }).map(() => ({
      top: Math.random() * 80,
      left: Math.random() * 80,
      delay: Math.random() * 5,
      size: 30 + Math.random() * 20,
    }));
    setElements(generated);
  }, []);

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            <LaunchScreen>
              {elements.map((g, i) => (
                <FloatingElement key={i} {...g} />
              ))}

              <LaunchText>
                Betanet v1
                <br />
                is Live
                <AnimatedDots>...</AnimatedDots>
              </LaunchText>

              <LaunchText style={{ fontSize: "12px", marginTop: "30px" }}>
                Box Tier & Swap Page Update! <br />
                Check Docs for Details!
              </LaunchText>
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}