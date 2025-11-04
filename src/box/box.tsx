import React from "react";
import { xToPx, yToPx } from "../app/position-helper";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { useDispatch, useSelector } from "react-redux";
import { showConfirmationMenu, hideConfirmationMenu, showText, showTransactionSuccess, hideText, selectText } from "../state/uiSlice";
import { selectPos, selectMap } from "../state/gameSlice";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// Switch to JS implementation to avoid TS/ESM bundling issues at runtime
import { sendSolana } from "./transaction";
import { boxStorage, BoxId } from "./box-storage";
import useIsMobile from "../app/use-is-mobile";
// import { hasAnySPLToken } from "./wallet-check";
// import { REQUIRED_SPL_TOKEN_ADDRESSES } from "../app/constants";

const BOX_SIZE_MOBILE = 28;
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

  // State to track if we're currently showing a message for this box
  const [isShowingMessage, setIsShowingMessage] = React.useState(false);
  const currentText = useSelector(selectText);

  // Reset the message state when the text is hidden
  React.useEffect(() => {
    if (isShowingMessage && !currentText) {
      setIsShowingMessage(false);
    }
  }, [isShowingMessage, currentText]);

  // Clean up the message state when the component unmounts
  React.useEffect(() => {
    return () => {
      if (isShowingMessage) {
        setIsShowingMessage(false);
      }
    };
  }, [isShowingMessage]);

  useEvent(Event.A, () => {
    // If we're already showing a message, don't process the event
    if (isShowingMessage) {
      return;
    }

    if (isPlayerOnBox && !isBoxOpened) {
      if (!connected) {
        setIsShowingMessage(true);
        dispatch(showText(["Connect wallet"]));
        return;
      }

      // Check if user holds required SPL tokens
      const checkTokensAndProceed = async () => {
        if (!publicKey) {
          setIsShowingMessage(true);
          dispatch(showText(["Wallet not connected properly"]));
          return;
        }

        // Additional check to ensure wallet is still connected
        if (!connected || !publicKey) {
          setIsShowingMessage(true);
          dispatch(showText(["Wallet disconnected. Please reconnect your wallet."]));
          return;
        }

        try {
          // const hasRequiredTokens = await hasAnySPLToken(
          //   connection,
          //   publicKey,
          //   REQUIRED_SPL_TOKEN_ADDRESSES
          // );

          // if (!hasRequiredTokens) {
          //   setIsShowingMessage(true);
          //   dispatch(hideConfirmationMenu());
          //   dispatch(showText([
          //     "Box Locked 🔒",
          //     "Hold POKEPIXEL to open it!",
          //     "minimum required 1pokepixel.",
          //     "See docs for more info."
          //   ]));
          //   return;
          // }

          // Don't mark box as opened immediately when player interacts
          // boxStorage.markBoxAsOpened(boxId);
          
          // Don't call onOpen immediately - we'll call it only on successful transaction
          // onOpen(x, y);
          
          // Always show the same message regardless of device
          const postMessage = "Transaction sent wait up!";
          
          dispatch(
            showConfirmationMenu({
              preMessage: "BOX found accept or decline?",
              postMessage: postMessage,
              confirm: () => {
                if (!publicKey) {
                  // This should not happen due to the connected check, but as a safeguard
                  return;
                }
                
                sendSolana(
                  connection,
                  publicKey,
                  sendTransaction
                ).then(([success, signature, mintSig, mintErr]) => {
                  dispatch(hideConfirmationMenu());
                  setIsShowingMessage(false); // Reset the message state
                  if (success && signature) {
                    // Show a combined success message and link via TransactionSuccess
                    dispatch(showTransactionSuccess(signature));
                    // Mark box as opened only when transaction is successful
                    boxStorage.markBoxAsOpened(boxId);
                    // Only call onOpen when transaction is successful
                    onOpen(x, y);
                  } else if (!success) {
                    // Handle transaction failure
                    const errorMessage = mintErr || "Transaction failed. Please try again.";
                    // Check if it's a cancellation message
                    if (errorMessage.includes("cancelled") || errorMessage.includes("rejected")) {
                      dispatch(showText([
                        "Transaction cancelled",
                        "Try wallet browser phantom, trust, mises",
                        "Click box again to retry"
                      ]));
                      // Don't mark box as opened for cancelled transactions
                      // Don't call onOpen for cancelled transactions
                    } else {
                      dispatch(showText([
                        "Transaction failed",
                        errorMessage,
                        "Please try again use build in wallet browser"
                      ]));
                      // Don't mark box as opened for failed transactions
                      // Don't call onOpen for failed transactions
                    }
                  } else if (mintErr) {
                    dispatch(showText([
                      "Transaction sent wait up!",
                    ]));
                    // Mark box as opened when transaction is sent
                    boxStorage.markBoxAsOpened(boxId);
                    // Call onOpen when transaction is sent
                    onOpen(x, y);
                  }
                }).catch((error) => {
                  dispatch(hideConfirmationMenu());
                  setIsShowingMessage(false); // Reset the message state
                  
                  console.error("SendSolana error:", error);
                  
                  // Handle different types of errors
                  let errorMessage = "Transaction failed. Please try again.";
                  
                  if (error?.name === "WalletSendTransactionError") {
                    errorMessage = "Transaction cancelled. You cancelled the transaction. Click box again to retry.";
                  } else if (error?.message) {
                    // Check for specific wallet errors
                    if (error.message.includes("WalletSendTransactionError")) {
                      errorMessage = "Transaction cancelled. You cancelled the transaction. Click box again to retry.";
                    } else if (error.message.includes("User rejected the request") || error.code === 4001) {
                      errorMessage = "Transaction cancelled. You cancelled the transaction. Click box again to retry.";
                    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                      errorMessage = "Network Error. Check network or use wallet browser like Phantom, Trust, Mises.";
                    } else {
                      errorMessage = error.message;
                    }
                  }
                  
                  // Check if it's a cancellation message
                  if (errorMessage.includes("cancelled") || errorMessage.includes("rejected")) {
                    dispatch(showText([
                      "Transaction cancelled",
                      "Try wallet browser phantom, trust, mises",
                      "Click box again to retry"
                    ]));
                    // Don't mark box as opened for cancelled transactions
                    // Don't call onOpen for cancelled transactions
                  } else {
                    dispatch(showText([
                      "Transaction failed",
                      errorMessage,
                      "Please try again"
                    ]));
                    // Don't mark box as opened for failed transactions
                    // Don't call onOpen for failed transactions
                  }
                });
              },
              cancel: () => {
                dispatch(hideConfirmationMenu());
                setIsShowingMessage(false); // Reset the message state
                // Inform user that box is still available during visibility time
                dispatch(showText([
                  "Transaction cancelled",
                  "Try wallet browser phantom, trust, mises",
                  "Click box again to retry"
                ]));
                // Don't call onOpen for cancelled transactions
              },
            })
          );
        } catch (error) {
          console.error("Error checking tokens:", error);
          setIsShowingMessage(false); // Reset the message state
          
          // Check if the error is a network issue
          if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            dispatch(showText([
              "Network Error",
              "Please check your internet connection",
              "and try again."
            ]));
          } else {
            dispatch(showText([
              "Error checking token balance",
              "Please try again later."
            ]));
          }
          
          // Re-throw the error so it can be handled as a mint error
          throw error;
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
      src={type === 'static' ? "/silver.png" : "/gold.png"}
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