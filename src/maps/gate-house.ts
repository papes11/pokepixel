import image from "../assets/map/gate-house.png";
import { MapId, MapType } from "./map-types";

const gateHouse: MapType = {
  name: "Gate House",
  image,
  height: 8,
  width: 10,
  start: {
    x: 4,
    y: 6,
  },
  walls: {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    1: [3, 6],
    6: [3, 6],
    7: [3, 6],
  },
  fences: {},
  grass: {},
  text: {
    0: {
      4: ["The door is locked."],
      5: ["The door is locked."],
    },
    2: {
      2: [
        "This gate house is part of Pokepixel!",
        "Even security checkpoints have mystery boxes!",
        "The blockchain protects all our borders!",
      ],
    },
  },
  maps: {},
  exits: {
    7: [4, 5],
  },
  exitReturnPos: {
    x: 8,
    y: 6,
  },
  exitReturnMap: MapId.Route22,
  boxes: [
    { x: 7, y: 3 }, // Right side of the gate house
  ],
};

export default gateHouse;
