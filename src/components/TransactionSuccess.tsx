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
  padding: 4px 12px;
  border: 2px solid #333;
  background-color: rgb(249, 242, 250);
  color: #333;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  margin-top: 3px;
  font-family: Arial, Helvetica, sans-serif;
  word-break: break-all;
  font-variant-numeric: tabular-nums;

  &:hover {
    background-color: #ddd;
  }
`;

interface TransactionSuccessProps {
  signature: string;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ signature }) => {
  const dispatch = useDispatch();
  const url = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

  useEvent(Event.A, () => {
    dispatch(hideTransactionSuccess());
  });

  return (
    <Container>
      <Frame wide tall>
        <div>🎉 Transaction complete!</div>
        <div>A new box has been added to your airdrop.</div>
        <LinkButton href={url} target="_blank" rel="noopener noreferrer">
          View on Explorer
        </LinkButton>
      </Frame>
    </Container>
  );
};

export default TransactionSuccess;
