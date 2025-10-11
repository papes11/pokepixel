import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Frame from './Frame';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Content = styled.div`
  max-width: 400px;
  padding: 20px;
  text-align: center;
  
  h2 {
    font-size: 18px;
    margin-bottom: 15px;
    color: black;
    font-family: "PokemonGB";
  }
  
  p {
    font-size: 12px;
    margin-bottom: 20px;
    line-height: 1.4;
    color: black;
  }
  
  .buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  button {
    padding: 8px 16px;
    border: 2px solid black;
    background: white;
    color: black;
    font-size: 12px;
    font-family: "PokemonGB";
    cursor: pointer;
    
    &:hover {
      background: #f0f0f0;
    }
    
    &.install {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
      
      &:hover {
        background: #45a049;
      }
    }
  }
`;

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onDismiss }) => {
  return (
    <Container>
      <Frame>
        <Content>
          <h2>📱 Install Pokepixel</h2>
          <p>
            Install Pokepixel as an app on your device for the best gaming experience!
            You'll get faster loading, offline access, and it will feel like a native app.
          </p>
          <p>
            🎮 Quick access from your home screen<br/>
            ⚡ Faster performance<br/>
            🔒 Secure Solana wallet integration
          </p>
          <div className="buttons">
            <button onClick={onDismiss}>
              Maybe Later
            </button>
            <button className="install" onClick={onInstall}>
              Install App
            </button>
          </div>
        </Content>
      </Frame>
    </Container>
  );
};

export default InstallPrompt;