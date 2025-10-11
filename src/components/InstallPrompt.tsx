import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const AppIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .app-name {
    font-size: 16px;
    font-weight: 600;
    color: white;
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
  
  .app-url {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    
    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    cursor: pointer;
    border-radius: 20px;
    transition: all 0.2s;
    font-weight: 500;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    &.install {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
      font-weight: 600;
      
      &:hover {
        background: #45a049;
        border-color: #45a049;
      }
    }
    
    @media (max-width: 480px) {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
  
  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    margin-left: 4px;
    
    &:hover {
      color: white;
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
        <AppIcon>
          🎮
        </AppIcon>
        <AppInfo>
          <div className="app-name">Install Pokepixel</div>
          <div className="app-url">www.pokepixel.xyz</div>
        </AppInfo>
      </LeftSection>
      <ButtonSection>
        <button className="install" onClick={onInstall}>
          Install
        </button>
        <button className="close-btn" onClick={onDismiss}>
          ×
        </button>
      </ButtonSection>
    </Banner>
  );
};

export default InstallPrompt;