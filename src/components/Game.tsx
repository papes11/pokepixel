import styled from "styled-components";


import { useSelector } from "react-redux";
import { selectPos, selectMap } from "../state/gameSlice";
import { selectLoadMenu } from "../state/uiSlice";
import Character from "./Character";
import Text from "./Text";
import MapChangeHandler from "./MapChangeHandler";
import StartMenu from "./StartMenu";
import KeyboardHandler from "./KeyboardHandler";
import MovementHandler from "./MovementHandler";
import ItemsMenu from "./ItemsMenu";
import PlayerMenu from "./PlayerMenu";
import PixelImage from "../styles/PixelImage";
import TitleScreen from "./TitleScreen";
import LoadScreen from "./LoadScreen";
import SoundHandler from "./SoundHandler";
import GameboyMenu from "./GameboyMenu";
import EncounterHandler from "./EncounterHandler";
import PokemonEncounter from "./PokemonEncounter";
import ActionOnPokemon from "./ActionOnPokemon";
import PokemonCenter from "./PokemonCenter";
import Pc from "./Pc";
import PokeMart from "./PokeMart";
import SpinningHandler from "./SpinningHandler";
import { MapItemType, TrainerType } from "../maps/map-types";
import Trainer from "./Trainer";
import { xToPx, yToPx } from "../app/position-helper";
import DebugOverlay from "./DebugOverlay";
import TrainerEncounter from "./TrainerEncounter";
import Item from "./Item";
import TextThenAction from "./TextThenAction";
import LearnMove from "../app/LearnMove";
import QuestHandler from "./QuestHandler";
import ConfirmationMenu from "./ConfirmationMenu";
import Evolution from "./Evolution";
import Box from "../box/box";
import React, { useEffect } from "react";
import TransactionSuccess from "./TransactionSuccess";
import MintSuccess from "./MintSuccess";
import { selectTransactionSuccess, selectMintSuccess } from "../state/uiSlice";


const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StyledGame = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  transform: translate(
    calc(50% - ${xToPx(1)} / 2),
    calc(50% - ${yToPx(1)} / 2)
  );
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  transition: transform 0.2s steps(5, end);
`;

interface BackgroundProps {
  width: number;
  height: number;
}

const Background = styled(PixelImage)<BackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => xToPx(props.width)};
  height: ${(props) => yToPx(props.height)};
`;

const ColorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  mix-blend-mode: darken;
  opacity: 0.5;
`;

const Game = () => {
  const pos = useSelector(selectPos);
  const map = useSelector(selectMap);
  const transactionSuccessSignature = useSelector(selectTransactionSuccess);
  const mintSuccessSignature = useSelector(selectMintSuccess);
  const loadMenu = useSelector(selectLoadMenu);

  // Generate multiple random box positions when the map changes
  const NUM_BOXES = 1; // Change this number for more/less boxes
  const [boxPositions, setBoxPositions] = React.useState<{ x: number; y: number; opened: boolean }[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const cycleStartedRef = React.useRef<boolean>(false);

  const VISIBLE_DURATION = 30000; // 30 seconds (visible window)
  const HIDDEN_DURATION = 30000; // 5 minutes (hidden window)
  const INITIAL_DELAY = 30000; // 2 minutes delay after new game/continue

  const showBoxes = React.useCallback(() => {
    if (!map) return;

    function getValidRandomPos(existing: { x: number; y: number }[]): { x: number; y: number } {
      let x: number, y: number, tries = 0;
      do {
        x = Math.floor(Math.random() * map.width);
        y = Math.floor(Math.random() * map.height);
        tries++;
      } while ((map.walls?.[y]?.includes(x) || existing.some(pos => pos.x === x && pos.y === y)) && tries < 100);
      return { x, y };
    }

    const positions: { x: number; y: number; opened: boolean }[] = [];
    for (let i = 0; i < NUM_BOXES; i++) {
      const pos = getValidRandomPos(positions);
      positions.push({ ...pos, opened: false });
    }
    setBoxPositions(positions);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(hideBoxes, VISIBLE_DURATION);
  }, [map]);

  const hideBoxes = React.useCallback(() => {
    setBoxPositions([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(showBoxes, HIDDEN_DURATION);
  }, [showBoxes]);

  // Start the initial 2-minute delay only when entering the game (load menu closes),
  // then run the 30s show / 5min hide loop.
  useEffect(() => {
    if (!loadMenu) {
      cycleStartedRef.current = true;
      setBoxPositions([]);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        showBoxes();
      }, INITIAL_DELAY);
    } else {
      // If returning to load menu, stop any timers and reset state
      cycleStartedRef.current = false;
      setBoxPositions([]);
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadMenu, showBoxes]);

  const handleOpen = (x: number, y: number) => {
    hideBoxes();
  };


  return (
    <Container>
      <StyledGame>
        <BackgroundContainer
          style={{
            transform: `translate(${xToPx(-pos.x)}, ${yToPx(-pos.y)})`,
          }}
        >
        <Background src={map.image} width={map.width} height={map.height} />
          {map.trainers &&
            map.trainers.map((trainer: TrainerType, index: number) => (
              <Trainer key={index} trainer={trainer} />
            ))}
          {map.items &&
            map.items.map((item: MapItemType, index: number) => (
              <Item key={index} item={item} />
            ))}
          {/* Render multiple boxes at random positions for the current map */}
          {boxPositions.map((box, idx) => (
            <Box key={idx} x={box.x} y={box.y} onOpen={handleOpen} />
          ))}
          <DebugOverlay />
        </BackgroundContainer>
        <Character />
        
      </StyledGame>
      

      <ColorOverlay />
      <TrainerEncounter />
      <PokemonEncounter />
      <Text />
      <PokemonCenter />
      <Pc />
      <PokeMart />
      <TextThenAction />
      <StartMenu />
      <ItemsMenu />
      <LearnMove />
      <PlayerMenu />
      <ActionOnPokemon />
      <Evolution />
      <ConfirmationMenu />
      {transactionSuccessSignature && <TransactionSuccess signature={transactionSuccessSignature} />}
      {mintSuccessSignature && <MintSuccess signature={mintSuccessSignature} />}
      <LoadScreen />
      <TitleScreen />
      <GameboyMenu />

      {/* Handlers */}
      <MapChangeHandler />
      <KeyboardHandler />
      <MovementHandler />
      <SoundHandler />
      <EncounterHandler />
      <SpinningHandler />
      <QuestHandler />
    </Container>
  );
};

export default Game;