import image from "../assets/map/route-2-gate.png";
import { MapId, MapType } from "./map-types";

const route2Gate: MapType = {
  name: "Route 2 Gate",
  image,
  height: 8,
  width: 10,
  start: {
    x: 4,
    y: 6,
  },
  walls: {
    0: [0, 1, 2, 3, 4, 6, 7, 8, 9],
    2: [0, 6, 8, 9],
    3: [0, 6, 8, 9],
    4: [0, 9],
    5: [0, 6, 8, 9],
    6: [0, 6, 8, 9],
    7: [0, 9],
  },
  fences: {},
  grass: {},
  text: {
    3: {
      7: [
        "Welcome to the Pokepixel route gate!",
        "Safe passage through our Solana world!",
        "Mystery boxes await in every checkpoint!",
      ],
    },
  },
  maps: {
    0: {
      5: MapId.ViridianForrest,
    },
  },
  exits: {
    7: [4, 5],
  },
  exitReturnPos: {
    x: 3,
    y: 44,
  },
  exitReturnMap: MapId.Route2,
  boxes: [
    { x: 7, y: 4 }, // Open area in the gate
  ],
};

export default route2Gate;
