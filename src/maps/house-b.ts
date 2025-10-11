import houseBImage from "../assets/map/house-b.png";
import { MapId, MapType } from "./map-types";

const houseB: MapType = {
  name: "House B",
  image: houseBImage,
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
    2: {
      2: [
        "A cozy home in the Pokepixel world!",
        "Even here, mystery boxes can appear!",
        "Your Solana adventure continues everywhere!",
      ],
    },
  },
  maps: {},
  exits: {
    7: [2, 3],
  },
  exitReturnPos: {
    x: 13,
    y: 6,
  },
  exitReturnMap: MapId.PalletTown,
  grass: {},
  boxes: [
    { x: 5, y: 2 }, // Upper right area of the house
  ],
};

export default houseB;
