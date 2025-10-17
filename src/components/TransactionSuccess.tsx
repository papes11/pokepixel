import React from "react";
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

const LinkButton = styled.a`
  display: block;
  padding: 1px 0px;
  border: 2px solid #333;
  background-color: rgb(249, 242, 250);
  color: #333;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  margin-top: 0px;
  font-family: Arial, Helvetica, sans-serif;
  word-break: break-all;
  font-variant-numeric: tabular-nums;

  &:hover {
    background-color: #ddd;
  }
`;

const ActionButton = styled.button`
  padding: 1px 0px;
  border: 2px solid #333;
  background-color: rgb(249, 242, 250);
  color: #333;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
  word-break: break-all;
  font-variant-numeric: tabular-nums;
  width: 100%;
  margin-top: 0px;

  &:hover {
    background-color: #ddd;
  }
`;

interface TransactionSuccessProps {
  signature: string;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ signature }) => {
  const dispatch = useDispatch();
  const url = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a confirmation message here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEvent(Event.A, () => {
    dispatch(hideTransactionSuccess());
  });

  return (
    <Container>
      <Frame wide tall>
        <div>⚔️ !Loot acquired! ⚔️</div>
        <div>Added to your Quest Box ✅</div>
        <div style={{ fontSize: '0.8em', marginTop: '4px', marginBottom: '4px' }}>
          Tx: {signature.substring(0, 10)}...{signature.substring(signature.length - 10)}
        </div>
        
        <LinkButton 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginBottom: '4px' }}
        >
          View on Explorer
        </LinkButton>
        
        <ActionButton onClick={copyToClipboard}>
          Copy Transaction
        </ActionButton>
      </Frame>
    </Container>
  );
};

export default TransactionSuccess;