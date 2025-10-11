import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10000;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 11px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  .logo {
    font-weight: bold;
    font-size: 14px;
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
  
  .message {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 4px 12px;
    border: 1px solid white;
    background: transparent;
    color: white;
    font-size: 11px;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &.install {
      background: white;
      color: #4CAF50;
      font-weight: bold;
      
      &:hover {
        background: #f0f0f0;
      }
    }
    
    @media (max-width: 480px) {
      padding: 3px 8px;
      font-size: 10px;
    }
  }
`;

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, onDismiss }) => {
  return (
    <Banner>
      <LeftSection>
        <div className="logo">🎮 Pokepixel</div>
        <div className="message">Install our app for the best gaming experience!</div>
      </LeftSection>
      <RightSection>
        <button onClick={onDismiss}>
          Cancel
        </button>
        <button className="install" onClick={onInstall}>
          Install
        </button>
      </RightSection>
    </Banner>
  );
};

export default InstallPrompt;