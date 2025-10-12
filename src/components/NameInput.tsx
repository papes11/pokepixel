import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setName, selectName } from "../state/gameSlice";
import { hideNameInput, selectNameInput } from "../state/uiSlice";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";

const StyledNameInput = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1100;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  background: white;
  border: 3px solid black;
  padding: 20px;
  border-radius: 0;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
  max-width: 320px;
  width: 85%;
  
  @media (max-width: 1000px) {
    padding: 5px;
    max-width: 140px;
    border: 2px solid black;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
  }
`;

const Title = styled.h1`
  font-family: "PokemonGB";
  font-size: 18px;
  color: black;
  text-align: center;
  margin-bottom: 12px;
  
  @media (max-width: 1000px) {
    font-size: 8px;
    margin-bottom: 4px;
  }
`;

const Subtitle = styled.p`
  font-family: "PokemonGB";
  font-size: 11px;
  color: black;
  text-align: center;
  margin-bottom: 15px;
  line-height: 1.4;
  
  @media (max-width: 1000px) {
    font-size: 6px;
    margin-bottom: 4px;
    line-height: 1.2;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  
  @media (max-width: 1000px) {
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-family: "PokemonGB";
  font-size: 14px;
  border: 2px solid black;
  background: white;
  color: black;
  text-align: center;
  outline: none;
  
  &:focus {
    background: #f0f0f0;
  }
  
  @media (max-width: 1000px) {
    font-size: 8px;
    padding: 4px;
    border: 2px solid black;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  
  @media (max-width: 1000px) {
    gap: 4px;
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  font-family: "PokemonGB";
  font-size: 12px;
  padding: 10px 16px;
  border: 2px solid black;
  background: ${props => props.$primary ? "#4CAF50" : "white"};
  color: black;
  cursor: pointer;
  transition: all 0.1s;
  
  &:hover {
    background: ${props => props.$primary ? "#45a049" : "#f0f0f0"};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 1000px) {
    font-size: 6px;
    padding: 4px 6px;
  }
`;

const NameInput: React.FC = () => {
  const dispatch = useDispatch();
  const show = useSelector(selectNameInput);
  const savedName = useSelector(selectName);
  const [playerName, setPlayerName] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Check if name is already saved and hide input if it exists
  useEffect(() => {
    const checkSavedName = () => {
      try {
        const savedPlayerName = localStorage.getItem('pokepixel_player_name');
        if (savedPlayerName && savedPlayerName.trim() && show) {
          // Load saved name into game state
          dispatch(setName(savedPlayerName));
          // Hide name input since we already have a name
          dispatch(hideNameInput());
        }
      } catch (error) {
        console.log('No saved name found');
      }
    };

    if (show) {
      checkSavedName();
    }
  }, [show, dispatch]);

  useEffect(() => {
    // Validate name (3-10 characters, letters only)
    const trimmedName = playerName.trim();
    setIsValid(trimmedName.length >= 3 && trimmedName.length <= 10 && /^[a-zA-Z]+$/.test(trimmedName));
  }, [playerName]);

  const handleConfirm = () => {
    if (isValid) {
      const trimmedName = playerName.trim();
      // Save name to game state
      dispatch(setName(trimmedName));
      // Save name to localStorage for persistence
      try {
        localStorage.setItem('pokepixel_player_name', trimmedName);
      } catch (error) {
        console.error('Failed to save name to localStorage:', error);
      }
      // Add a small delay before hiding to prevent event propagation
      setTimeout(() => {
        dispatch(hideNameInput());
      }, 100);
    }
  };

  const handleDefault = () => {
    const defaultName = "Trainer";
    // Save default name to game state
    dispatch(setName(defaultName));
    // Save name to localStorage for persistence
    try {
      localStorage.setItem('pokepixel_player_name', defaultName);
    } catch (error) {
      console.error('Failed to save name to localStorage:', error);
    }
    // Add a small delay before hiding to prevent event propagation
    setTimeout(() => {
      dispatch(hideNameInput());
    }, 100);
  };

  useEvent(Event.A, () => {
    if (!show) return;
    if (isValid) {
      handleConfirm();
    }
  });

  useEvent(Event.B, () => {
    if (!show) return;
    handleDefault();
  });

  if (!show) return null;

  return (
    <StyledNameInput>
      <Container>
        <Title>Welcome, Player!</Title>
        <Subtitle>
          What&apos;s your name?<br />
          (3-10 letters only)
        </Subtitle>
        
        <InputContainer>
          <Input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={10}
            placeholder="Your name"
            autoFocus
          />
        </InputContainer>
        
        <ButtonContainer>
          <Button onClick={handleDefault}>
            Use Default
          </Button>
          <Button 
            $primary 
            onClick={handleConfirm}
            disabled={!isValid}
          >
            Confirm
          </Button>
        </ButtonContainer>
        
        <Subtitle style={{ marginTop: "15px", fontSize: "9px" }}>
          A = Confirm • B = Default
        </Subtitle>
      </Container>
    </StyledNameInput>
  );
};

export default NameInput;