import image from "../assets/map/viridian-city-poke-mart.png";
import { MapId, MapType } from "./map-types";

import music from "../assets/music/maps/pokemon-center.mp3";
import { ItemType } from "../app/use-item-data";

const viridianCityPokeMart: MapType = {
  name: "Viridian City Poke Mart",
  image,
  height: 8,
  width: 8,
  start: {
    x: 4,
    y: 6,
  },
  walls: {
    1: [0, 1, 2, 3, 4, 5, 6, 7],
    3: [0, 1, 4, 5, 6, 7],
    4: [1, 4, 5, 6, 7],
    5: [1],
    6: [0, 1],
  },
  text: {
    3: {
      6: [
        "Welcome to our Solana-powered Poke Mart!",
        "Buy items and find mystery boxes too!",
        "Everything here runs on blockchain technology!",
      ],
    },
  },
  maps: {},
  exits: {
    7: [3, 4],
  },
  music,
  grass: {},
  exitReturnMap: MapId.ViridianCity,
  exitReturnPos: {
    x: 29,
    y: 20,
  },
  store: {
    x: 1,
    y: 5,
  },
  storeItems: [
    ItemType.PokeBall,
    // ItemType.Antidote, TODO Add this
    // ItemType.ParalyzeHeal, TODO Add this
    // ItemType.BurnHeal, TODO Add this
  ],
  boxes: [
    { x: 6, y: 4 }, // Corner area away from the store counter
  ],
};

export default viridianCityPokeMart;
