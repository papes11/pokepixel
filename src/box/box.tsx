import React from "react";
import { xToPx, yToPx } from "../app/position-helper";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { useDispatch, useSelector } from "react-redux";
import { showConfirmationMenu, hideConfirmationMenu, showText, showTransactionSuccess } from "../state/uiSlice";
import { selectPos } from "../state/gameSlice";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// Switch to JS implementation to avoid TS/ESM bundling issues at runtime
import { sendSolana } from "./transaction";

const BOX_SIZE = 16;

interface BoxProps {
  x: number;
  y: number;
  onOpen: (x: number, y: number) => void;
}

const Box: React.FC<BoxProps> = ({ x, y, onOpen }) => {
  const dispatch = useDispatch();
  const playerPos = useSelector(selectPos);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const isPlayerOnBox = playerPos.x === x && playerPos.y === y;

  useEvent(Event.A, () => {
    if (isPlayerOnBox) {
      if (!connected) {
        dispatch(showText(["Connect wallet"]));
        return;
      }

      onOpen(x, y);
      dispatch(
        showConfirmationMenu({
          preMessage: "BOX found accept or decline?",
          postMessage: "Transaction sent wait up!",
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
              if (success && signature) {
                // Show a combined success message and link via TransactionSuccess
                dispatch(showTransactionSuccess(signature));
              }
              if (mintErr) {
                dispatch(showText(["Box open failed:"]));
              }
            });
          },
          cancel: () => {
            dispatch(hideConfirmationMenu());
          },
        })
      );
    }
  });

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