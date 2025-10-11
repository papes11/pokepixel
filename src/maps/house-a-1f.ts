import houseA1FImage from "../assets/map/house-a-1f.png";
import { MapId, MapType } from "./map-types";

const houseA1f: MapType = {
  name: "House A 1F",
  image: houseA1FImage,
  height: 8,
  width: 8,
  start: {
    x: 3,
    y: 6,
  },
  walls: {
    0: [0, 1, 2, 3, 4, 5, 6, 7],
    1: [0, 1, 3],
    4: [3, 4],
    5: [3, 4],
  },
  text: {
    1: {
      3: [
        "There's a movie on TV.",
        "Four boys are walking on railroad tracks.",
        "This Solana world has endless adventures too!",
        "I better go explore!",
      ],
    },
  },
  maps: {
    1: {
      7: MapId.PalletTownHouseA2F,
    },
  },
  exits: {
    7: [2, 3],
  },
  exitReturnPos: {
    x: 5,
    y: 6,
  },
  exitReturnMap: MapId.PalletTown,
  grass: {},
  boxes: [
    { x: 5, y: 3 }, // Upper right corner, easily accessible
  ],
};

export default houseA1f;
