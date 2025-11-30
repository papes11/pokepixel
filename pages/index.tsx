import React from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import Gameboy from "../src/components/Gameboy";
import Paint from "../src/components/Paint";
import { PAINT_MODE } from "../src/app/constants";
import Game from "../src/components/Game";
import MaintenancePage from "./maintenance";

// Toggle this to enable/disable maintenance mode
// When hosting on Vercel, set to true for a 3-minute maintenance period
// After 3 minutes, the game will be accessible to everyone
const MAINTENANCE_MODE = false;

const StyledApp = styled.div`
  background: black;
  width: 100vw;
  height: 100dvh;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  padding-bottom: 25px;

  @media (min-width: 1000px) {
    padding: 5px;
  }
`;

export default function HomePage() {
  const [isMaintenanceActive, setIsMaintenanceActive] = React.useState(true);
  
  // Show maintenance page if maintenance mode is enabled
  if (MAINTENANCE_MODE && isMaintenanceActive) {
    return <MaintenancePage onLaunch={() => setIsMaintenanceActive(false)} />;
  }

  return (
    <StyledApp>
      <Gameboy>
        <Game />
        {PAINT_MODE && <Paint />}
      </Gameboy>
    </StyledApp>
  );
}