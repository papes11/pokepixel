import styled, { keyframes } from "styled-components";
import PixelImage from "../styles/PixelImage";
import { CleanPixelImage } from "../styles/PixelImage";

import title from "../assets/title-screen/poke.png";
import subtitle from "../assets/title-screen/pixel.png";
import player from "../assets/title-screen/player.png";
import { useEffect, useState } from "react";
import usePokemon from "../app/use-pokemon-metadata";
import useEvent from "../app/use-event";
import { Event } from "../app/emitter";
import { useDispatch, useSelector } from "react-redux";
import {
  hideTitleMenu,
  selectGameboyMenu,
  selectTitleMenu,
  showNameInput,
} from "../state/uiSlice";
import { setName } from "../state/gameSlice";

const StyledTitleScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0%;
`;

const falldown = keyframes`
  0% {
    transform: translateY(-200%);
  }
  33% {
    transform: translateY(-200%);
  }
  67% {
    transform: translateY(0)
  }
  100% {
    transform: translateY(0)
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: 50%;
  position: relative;
`;

const slideIn = keyframes`
  0% {
    transform: translateY(-50%) translateX(200%);
  }
  67% {
    transform: translateY(-50%) translateX(200%);
  }
  100% {
    transform: translateY(-50%) translateX(0)
  }
`;

const Title = styled(PixelImage)`
  height: 100%;
  width: 80%;
  animation: ${falldown} 3s ease-in-out;
`;

const SubTitle = styled(PixelImage)`
  height: 100%;
  position: absolute;
  top: 85%;
  transform: translateY(-50%);

  animation: ${slideIn} 3s ease-in-out;
`;

const PokemonPlayerContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Player = styled(PixelImage)`
  height: 100%;
  transform: translateX(-13%);
`;

const slideInAndOut = keyframes`
  0% {
    transform: translateX(400%);
  }
  10% {
    transform: translateX(13%);
  }
  90% {
    transform: translateX(13%);
  }
  100% {
    transform: translateX(-400%);
  }
`;

const Pokemon = styled(PixelImage)`
  height: 100%;
  transform: translateX(13%);

  animation: ${slideInAndOut} 5s linear infinite;
`;

const TitleScreen = () => {
  const dispatch = useDispatch();
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const show = useSelector(selectTitleMenu);
  const gameboyMenuOpen = useSelector(selectGameboyMenu);

  const pokemon = usePokemon(pokemonId);

  const randomPokemon = () => {
    setPokemonId(Math.floor(Math.random() * 151) + 1);
  };

  useEffect(() => {
    randomPokemon();

    const interval = setInterval(() => {
      randomPokemon();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEvent(Event.A, () => {
    if (!show || gameboyMenuOpen) return;
    
    // Check if player name is already saved
    try {
      const savedPlayerName = localStorage.getItem('pokepixel_player_name');
      if (savedPlayerName && savedPlayerName.trim()) {
        // Load saved name and skip name input
        dispatch(setName(savedPlayerName));
        dispatch(hideTitleMenu());
        return;
      }
    } catch (error) {
      console.log('No saved name found');
    }
    
    // No saved name, show name input
    dispatch(hideTitleMenu());
    dispatch(showNameInput());
  });

  if (!show) return null;

  return (
    <StyledTitleScreen>
      <TitleSection>
        <Title src={title} />
        <SubTitle src={subtitle}/>
      </TitleSection> 
      <PokemonPlayerContainer>
        {pokemon && <Pokemon src={pokemon.images.front} />}
        <Player src={player} />
      </PokemonPlayerContainer>
    </StyledTitleScreen>
  );
};

export default TitleScreen;
