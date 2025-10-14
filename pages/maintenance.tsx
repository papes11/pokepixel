// import React from 'react';
// import styled from 'styled-components';
// import Gameboy from '../src/components/Gameboy';
// import GlobalStyles from '../src/styles/GlobalStyles';
// import WalletContextProvider from '../src/wallets/wallet-provider';
// import { Provider } from 'react-redux';
// import { store } from '../src/state/store';
// import InstallPrompt from '../src/components/InstallPrompt';
// import { usePWAInstall } from '../src/hooks/usePWAInstall';

// const StyledApp = styled.div`
//   background: black;
//   width: 100vw;
//   height: 100dvh;
//   border-radius: 20px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 2px;
//   padding-bottom: 25px;

//   @media (min-width: 1000px) {
//     padding: 5px;
//   }
// `;

// const MaintenanceScreen = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   background:rgb(10, 10, 8);
//   font-family: 'Press Start 2P', monospace;
//   padding: 20px;
//   text-align: center;
// `;

// const MaintenanceText = styled.div`
//   color: #0f380f;
//   font-size: 18px;
//   font-weight: bold;
//   line-height: 1.8;
//   text-shadow: 2px 2px 0px #8bac0f;
//   margin-bottom: 10px;
//   font-family: monospace;

//   @media (max-width: 640px) {
//     font-size: 14px;
//   }
// `;

// const AnimatedDots = styled.span`
//   @keyframes blink {
//     0%, 100% { opacity: 1; }
//     50% { opacity: 0; }
//   }
//   animation: blink 1.5s infinite;
// `;

// export default function MaintenancePage() {
//   // PWA Install functionality
//   const { showInstallPrompt, installApp, dismissPrompt } = usePWAInstall();

//   return (
//     <WalletContextProvider>
//       <Provider store={store}>
//         <GlobalStyles />
//         {showInstallPrompt && (
//           <InstallPrompt 
//             onInstall={installApp} 
//             onDismiss={dismissPrompt} 
//           />
//         )}
//         <StyledApp>
//           <Gameboy>
//             <MaintenanceScreen>
//               <MaintenanceText>
//                 UNDER
//                 <br />
//                 MAINTENANCE
//                 <AnimatedDots>...</AnimatedDots>
//               </MaintenanceText>
//               <MaintenanceText style={{ fontSize: '12px', marginTop: '30px' }}>
//                 WE&apos;LL BE
//                 <br />
//                 BACK SOON!
//               </MaintenanceText>
//             </MaintenanceScreen>
//           </Gameboy>
//         </StyledApp>
//       </Provider>
//     </WalletContextProvider>
//   );
// }
import React from 'react';
import styled from 'styled-components';
import Gameboy from '../src/components/Gameboy';
import GlobalStyles from '../src/styles/GlobalStyles';
import WalletContextProvider from '../src/wallets/wallet-provider';
import { Provider } from 'react-redux';
import { store } from '../src/state/store';
import InstallPrompt from '../src/components/InstallPrompt';
import { usePWAInstall } from '../src/hooks/usePWAInstall';

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

const AnimatedDots = styled.span`
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  animation: blink 1.5s infinite;
`;

export default function LaunchPage() {
  // PWA Install functionality
  const { showInstallPrompt, installApp, dismissPrompt } = usePWAInstall();

  return (
    <WalletContextProvider>
      <Provider store={store}>
        <GlobalStyles />
        <StyledApp>
          <Gameboy>
            {showInstallPrompt && (
          <InstallPrompt 
            onInstall={installApp} 
            onDismiss={dismissPrompt} 
          />
        )}
            <LaunchScreen>
              <LaunchText>
                ALPHANET
                <br />
                IS LIVE
                <AnimatedDots>...</AnimatedDots>
              </LaunchText>
              <LaunchText style={{ fontSize: '12px', marginTop: '30px' }}>
                LAUNCHING
                <br />
                SOON!
              </LaunchText>
            </LaunchScreen>
          </Gameboy>
        </StyledApp>
      </Provider>
    </WalletContextProvider>
  );
}