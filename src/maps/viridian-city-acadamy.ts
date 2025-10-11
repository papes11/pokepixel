import image from "../assets/map/viridian-city-pokemon-acadamy.png";
import { MapId, MapType } from "./map-types";

const viridianCityAcadamy: MapType = {
  name: "Viridian City Academy",
  image,
  height: 8,
  width: 8,
  start: {
    x: 2,
    y: 6,
  },
  walls: {
    0: [0, 1, 2, 3, 4, 5, 6, 7],
    1: [7],
    3: [3, 4],
    4: [3, 4],
    6: [0, 7],
    7: [0, 7],
  },
  text: {
    0: {
      3: [
        "Welcome to Pokepixel Academy!",
        "Learn about blockchain gaming here!",
        "Understanding Solana is key to success!",
        "Knowledge and rewards go hand in hand!",
      ],
    },
    4: {
      3: [
        "Today's lesson: Decentralized Gaming!",
        "In Pokepixel, you truly own your progress!",
        "Every achievement is stored on-chain!",
        "The future of gaming is here!",
      ],
    },
  },
  maps: {},
  exits: {
    7: [2, 3],
  },
  grass: {},
  exitReturnMap: MapId.ViridianCity,
  exitReturnPos: {
    x: 21,
    y: 16,
  },
};

export default viridianCityAcadamy;
