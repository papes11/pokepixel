import React, { useState } from "react";
import styled from "styled-components";
import Frame from "./Frame";
import { useDispatch } from "react-redux";
import { hideTransactionSuccess } from "../state/uiSlice";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 100;

  @media (max-width: 1000px) {
    height: 30%;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1px 0;
  margin-top: 1px;
  border: 2px solid #333;
  background: linear-gradient(180deg, #14f195 0%, #9945ff 100%);
  color: white;
  font-weight: bold;
  font-family: "Press Start 2P", monospace;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  border-radius: 8px;
  box-shadow: 0 4px 0 #222;
  text-shadow: 1px 1px 2px #000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #222;
    background: linear-gradient(180deg, #9945ff 0%, #14f195 100%);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 #222;
  }
`;

interface TransactionSuccessProps {
  signature: string;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ signature }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const url = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEvent(Event.A, () => {
    dispatch(hideTransactionSuccess());
  });

  return (
    <Container>
      <Frame wide tall>
        <div>⚔️ Loot Acquired! ⚔️</div>
        <div>Added to your Quest Box ✅</div>
        <ActionButton onClick={copyToClipboard}>
          {copied ? "Copied! ✅" : "Copy Transaction"}
        </ActionButton>
      </Frame>
    </Container>
  );
};

export default TransactionSuccess;
