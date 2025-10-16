import React from "react";
import { xToPx, yToPx } from "../app/position-helper";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { useDispatch, useSelector } from "react-redux";
import { showConfirmationMenu, hideConfirmationMenu, showText, showTransactionSuccess } from "../state/uiSlice";
import { selectPos, selectMap } from "../state/gameSlice";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// Switch to JS implementation to avoid TS/ESM bundling issues at runtime
import { sendSolana } from "./transaction";
import { boxStorage, BoxId } from "./box-storage";
import useIsMobile from "../app/use-is-mobile";
import { hasAnySPLToken } from "./wallet-check";
import { REQUIRED_SPL_TOKEN_ADDRESSES } from "../app/constants";

const BOX_SIZE_MOBILE = 16;
const BOX_SIZE_TABLET = 32;
const BOX_SIZE_DESKTOP = 64;

interface BoxProps {
  x: number;
  y: number;
  type?: 'static' | 'dynamic';
  onOpen: (x: number, y: number) => void;
}

const Box: React.FC<BoxProps> = ({ x, y, type = 'dynamic', onOpen }) => {
  const dispatch = useDispatch();
  const playerPos = useSelector(selectPos);
  const map = useSelector(selectMap);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const isMobile = useIsMobile();

  // Determine box size based on screen width
  const getBoxSize = () => {
    if (isMobile) return BOX_SIZE_MOBILE;
    if (window.innerWidth >= 768 && window.innerWidth < 1000) return BOX_SIZE_TABLET;
    return BOX_SIZE_DESKTOP;
  };

  const BOX_SIZE = getBoxSize();

  const isPlayerOnBox = playerPos.x === x && playerPos.y === y;
  
  // Create box identifier
  const boxId: BoxId = {
    mapId: map.name,
    x,
    y,
    type
  };
  
  // Check if this box has already been opened
  const isBoxOpened = boxStorage.isBoxOpened(boxId);

  // Mobile detection helper
  const isMobileBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = ['android', 'iphone', 'ipad', 'ipod', 'mobile'].some(keyword => userAgent.includes(keyword));
    const isInWalletBrowser = userAgent.includes('phantom') || userAgent.includes('solflare') || userAgent.includes('trust');
    return isMobile && !isInWalletBrowser;
  };

  useEvent(Event.A, () => {
    if (isPlayerOnBox && !isBoxOpened) {
      if (!connected) {
        dispatch(showText(["Connect wallet"]));
        return;
      }

      // Check if user holds required SPL tokens
      const checkTokensAndProceed = async () => {
        if (!publicKey) {
          dispatch(showText(["Wallet not connected properly"]));
          return;
        }

        try {
          const hasRequiredTokens = await hasAnySPLToken(
            connection,
            publicKey,
            REQUIRED_SPL_TOKEN_ADDRESSES
          );

          if (!hasRequiredTokens) {
            dispatch(showText([
              "Box Locked 🔒",
              "Hold POKEPIXEL to open it!",
              "No minimum required.",
              "See docs for more info."
            
            ]));
            return;
          }

          // Mark box as opened immediately when player interacts
          boxStorage.markBoxAsOpened(boxId);
          
          onOpen(x, y);
          
          // Check if mobile browser and show appropriate message
          const postMessage = isMobileBrowser() 
            ? "Use wallet built-in browser (Phantom, Solflare, Trust, etc)" 
            : "Transaction sent wait up!";
          
          dispatch(
            showConfirmationMenu({
              preMessage: "BOX found accept or decline?",
              postMessage: postMessage,
              confirm: () => {
                if (!publicKey) {
                  // This should not happen due to the connected check, but as a safeguard
                  return;
                }
                
                // Show guidance for mobile browser users
                if (isMobileBrowser()) {
                  dispatch(hideConfirmationMenu());
                  dispatch(showText([
                    "Mobile Browser Detected",
                    "",
                    "For Box opening, please:",
                    "",
                    "1. Use wallet built-in browser",
                    "2. Open your wallet app",
                    " (Phantom, Solflare, Trust)",
                    "3. Navigate to this site",
                    "4. Try again"
                  ]));
                  return;
                }
                
                sendSolana(
                  connection,
                  publicKey,
                  sendTransaction
                ).then(([success, signature, mintSig, mintErr]) => {
                  dispatch(hideConfirmationMenu());
                  if (success && signature) {
                    // Show a combined success message and link via TransactionSuccess
                    dispatch(showTransactionSuccess(signature));
                  }
                  if (mintErr) {
                    dispatch(showText(["Box open failed"]));
                  }
                });
              },
              cancel: () => {
                dispatch(hideConfirmationMenu());
              },
            })
          );
        } catch (error) {
          console.error("Error checking tokens:", error);
          dispatch(showText(["Error checking token balance"]));
        }
      };

      checkTokensAndProceed();
    }
  });
  
  // Don't render if box is already opened - moved after all hooks
  if (isBoxOpened) {
    return null;
  }

  return (
    <img
      src={"/boxx.png"}
      alt="Mystery Box"
      style={{
        position: "absolute",
        left: xToPx(x),
        top: yToPx(y),
        width: BOX_SIZE,
        height: BOX_SIZE,
        zIndex: 1000,
        pointerEvents: "none",
      }}
    />
  );
};

export default Box;