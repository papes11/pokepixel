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
import swampTimer from "../box/swamp-timer";
import TransactionSuccess from "./TransactionSuccess";
import MintSuccess from "./MintSuccess";
import InstallPrompt from "./InstallPrompt";
import { selectTransactionSuccess, selectMintSuccess } from "../state/uiSlice";
import { usePWAInstall } from "../hooks/usePWAInstall";


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
  
  // PWA Install functionality
  const { showInstallPrompt, installApp, dismissPrompt } = usePWAInstall();

  // Generate multiple random box positions when the map changes
  const NUM_BOXES = 1; // Change this number for more/less boxes
  const [boxPositions, setBoxPositions] = React.useState<{ x: number; y: number; opened: boolean }[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const cycleStartedRef = React.useRef<boolean>(false);

  const VISIBLE_DURATION = 30000; // 30 seconds visible window

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
    // After visible window, hide and schedule next 4–5m via swampTimer
    timerRef.current = setTimeout(() => {
      hideBoxes();
    }, VISIBLE_DURATION);
  }, [map]);

  const hideBoxes = React.useCallback(() => {
    setBoxPositions([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Persist and schedule next interval (4–5m randomized)
    const next = swampTimer.scheduleNext();
    const waitMs = Math.max(0, next.nextAtMs - Date.now());
    timerRef.current = setTimeout(showBoxes, waitMs);
  }, [showBoxes]);

  // On entering game (load menu closes), handle new vs refresh appropriately:
  useEffect(() => {
    if (!loadMenu) {
      cycleStartedRef.current = true;
      setBoxPositions([]);
      if (timerRef.current) clearTimeout(timerRef.current);

      // Check if this is a first-time user or returning user
      const currentState = swampTimer.getState();
      
      let waitMs: number;
      if (!currentState.seen) {
        // First-time user - start fresh 5-minute timer
        const freshState = swampTimer.startFreshGameTimer();
        waitMs = Math.max(0, freshState.nextAtMs - Date.now());
      } else {
        // User has seen boxes before - always reset to 5 minutes on page refresh
        const refreshState = swampTimer.resetOnRefresh();
        waitMs = Math.max(0, refreshState.nextAtMs - Date.now());
      }
      
      timerRef.current = setTimeout(() => {
        showBoxes();
      }, waitMs);
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
    // On open, hide and schedule next randomized interval
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
            <Box key={idx} x={box.x} y={box.y} type="dynamic" onOpen={handleOpen} />
          ))}
          {/* Render static boxes defined in map data */}
          {map.boxes &&
            map.boxes.map((boxPos, index) => (
              <Box key={`static-${index}`} x={boxPos.x} y={boxPos.y} type="static" onOpen={handleOpen} />
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
      {showInstallPrompt && (
        <InstallPrompt 
          onInstall={installApp} 
          onDismiss={dismissPrompt} 
        />
      )}
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