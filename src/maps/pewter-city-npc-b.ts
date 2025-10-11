import image from "../assets/map/pewter-city-npc-house.png";
import { MapId, MapType } from "./map-types";

const peweterCityNpcB: MapType = {
  name: "Pewter City NPC House B",
  image,
  height: 8,
  width: 8,
  start: {
    x: 3,
    y: 6,
  },
  walls: {
    0: [0, 1, 2, 3, 4, 5, 6, 7],
    1: [0, 1, 7],
    3: [3, 4],
    4: [3, 4],
    6: [0, 7],
    7: [0, 7],
  },
  text: {
    4: {
      5: [
        "This house is part of the Pokepixel network!",
        "Every location has hidden treasures!",
        "Your on-chain journey is full of surprises!",
      ],
    },
  },
  maps: {},
  exits: {
    7: [2, 3],
  },
  exitReturnPos: {
    x: 29,
    y: 14,
  },
  exitReturnMap: MapId.PewterCity,
  grass: {},
  boxes: [
    { x: 2, y: 2 }, // Upper left corner, accessible area
  ],
};

export default peweterCityNpcB;
