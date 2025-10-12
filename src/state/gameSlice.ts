import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { MapId, MapItemType, MapWithPos, TrainerType } from "../maps/map-types";
import palletTown from "../maps/pallet-town";
import { getPokemonStats } from "../app/use-pokemon-stats";
import mapData from "../maps/map-data";
import { getMoveMetadata } from "../app/use-move-metadata";
import { ItemType } from "../app/use-item-data";
import { canWalk, isFence, isItem, isTrainer, isWall } from "../app/map-helper";
import {
  Direction,
  GameState,
  InventoryItemType,
  PokemonEncounterType,
  PokemonInstance,
  PosType,
} from "./state-types";

const initialState: GameState = {
  pos: palletTown.start,
  jumping: false,
  moving: false,
  direction: Direction.Down,
  map: MapId.PalletTown,
  money: 400,
  inventory: [
    {
      item: ItemType.MaxPotion,
      amount: 1,
    },
    {
      item: ItemType.PokeBall,
      amount: 2,
    },
  ],
  name: "",
  pokemon: [
    {
      id: 1,
      level: 5,
      xp: 0,
      hp: 10,
      moves: [
        { id: "tackle", pp: 35 },
        { id: "growl", pp: 40 },
      ],
    },
    {
      id: 4,
      level: 5,
      xp: 0,
      hp: 19,
      moves: [
        { id: "scratch", pp: 35 },
        { id: "growl", pp: 40 },
      ],
    },
    {
      id: 7,
      level: 5,
      xp: 0,
      hp: 19,
      moves: [
        { id: "tackle", pp: 35 },
        { id: "tail-whip", pp: 30 },
      ],
    },
  ],
  pc: [
    {
      id: 1,
      level: 5,
      xp: 0,
      hp: 19,
      moves: [
        { id: "tackle", pp: 35 },
        { id: "growl", pp: 40 },
      ],
    },
  ],
  activePokemonIndex: 0,
  trainerEncounter: undefined,
  defeatedTrainers: [],
  collectedItems: [],
  completedQuests: [],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // Initialize name from localStorage on app start
    initializeName: (state) => {
      try {
        const savedPlayerName = localStorage.getItem('pokepixel_player_name');
        if (savedPlayerName && savedPlayerName.trim()) {
          state.name = savedPlayerName;
        }
      } catch (error) {
        console.log('No saved name found during initialization');
      }
    },
    moveLeft: (state) => {
      state.direction = Direction.Left;
      if (state.pos.x === 0) return;
      if (
        !canWalk(state.pos.x - 1, state.pos.y, state.map, state.collectedItems)
      )
        return;
      state.pos.x -= 1;
    },
    moveRight: (state) => {
      state.direction = Direction.Right;
      const map = mapData[state.map];
      if (state.pos.x === map.width - 1) return;
      if (
        !canWalk(state.pos.x + 1, state.pos.y, state.map, state.collectedItems)
      )
        return;
      state.pos.x += 1;
    },
    moveUp: (state) => {
      state.direction = Direction.Up;
      if (state.pos.y === 0) return;
      if (
        !canWalk(state.pos.x, state.pos.y - 1, state.map, state.collectedItems)
      )
        return;
      state.pos.y -= 1;
    },
    moveDown: (state) => {
      state.direction = Direction.Down;
      const map = mapData[state.map];
      if (state.pos.y === map.height - 1) return;
      if (isFence(map.fences, state.pos.x, state.pos.y + 1)) {
        state.jumping = true;
      }
      if (isWall(map.walls, state.pos.x, state.pos.y + 1)) return;
      if (isTrainer(map.trainers, state.pos.x, state.pos.y + 1)) return;
      if (
        isItem(
          map.items,
          state.pos.x,
          state.pos.y + 1,
          state.collectedItems,
          state.map
        )
      )
        return;
      state.pos.y += 1;
    },
    setPos: (state, action: PayloadAction<PosType>) => {
      state.pos = action.payload;
    },
    setMap: (state, action: PayloadAction<MapId>) => {
      state.map = action.payload;
      const map = mapData[action.payload];
      state.pos = map.start;
    },
    setMapWithPos: (state, action: PayloadAction<MapWithPos>) => {
      state.map = action.payload.map;
      state.pos = action.payload.pos;
    },
    exitMap(state) {
      const map = mapData[state.map];
      if (!map) return;
      if (!map.exitReturnMap) return;
      const previousMap = mapData[map.exitReturnMap];
      if (!previousMap) throw new Error("No previous map");
      const newPos = map.exitReturnPos;
      if (previousMap && newPos) {
        state.map = map.exitReturnMap;
        state.pos = newPos;
      }
    },
    setMoving: (state, action: PayloadAction<boolean>) => {
      state.moving = action.payload;
    },
    addInventory: (state, action: PayloadAction<InventoryItemType>) => {
      let found = false;

      for (let i = 0; i < state.inventory.length; i++) {
        if (state.inventory[i].item !== action.payload.item) continue;
        state.inventory[i].amount += action.payload.amount;
        found = true;
      }

      if (!found) {
        state.inventory.push(action.payload);
      }
    },
    removeInventory: (state, action: PayloadAction<InventoryItemType>) => {
      for (let i = 0; i < state.inventory.length; i++) {
        if (state.inventory[i].item !== action.payload.item) continue;
        state.inventory[i].amount -= action.payload.amount;
      }
    },
    consumeItem: (state, action: PayloadAction<ItemType>) => {
      const item = state.inventory.find((i) => i.item === action.payload);
      if (!item) return;
      item.amount -= 1;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    save: (state) => {
      localStorage.setItem(state.name, JSON.stringify(state));
    },
    load: (state) => {
      const savedGame = localStorage.getItem(state.name);
      if (!savedGame) return;
      const savedGameState = JSON.parse(savedGame) as GameState;
      state.pos = savedGameState.pos;
      state.direction = savedGameState.direction;
      state.map = savedGameState.map;
      state.inventory = savedGameState.inventory;
      state.name = savedGameState.name;
      state.pokemon = savedGameState.pokemon;
      state.pokemonEncounter = savedGameState.pokemonEncounter;
      state.activePokemonIndex = savedGameState.activePokemonIndex;
      state.money = savedGameState.money;
      state.pc = savedGameState.pc;
      state.trainerEncounter = savedGameState.trainerEncounter;
      state.defeatedTrainers = savedGameState.defeatedTrainers;
      state.collectedItems = savedGameState.collectedItems;
      state.completedQuests = savedGameState.completedQuests;
    },
    swapPokemonPositions: (state, action: PayloadAction<number[]>) => {
      const [index1, index2] = action.payload;
      const temp = state.pokemon[index1];
      state.pokemon[index1] = state.pokemon[index2];
      state.pokemon[index2] = temp;
    },
    encounterPokemon: (state, action: PayloadAction<PokemonEncounterType>) => {
      state.pokemonEncounter = action.payload;
    },
    endEncounter: (state) => {
      state.pokemonEncounter = undefined;
    },
    setActivePokemon: (state, action: PayloadAction<number>) => {
      state.activePokemonIndex = action.payload;
    },
    updatePokemonEncounter: (
      state,
      action: PayloadAction<PokemonEncounterType>
    ) => {
      if (!state.pokemonEncounter) return;
      state.pokemonEncounter.hp = action.payload.hp;
    },
    updatePokemon: (state, action: PayloadAction<PokemonInstance>) => {
      state.pokemon[state.activePokemonIndex] = action.payload;
    },
    updateSpecificPokemon: (
      state,
      action: PayloadAction<{ index: number; pokemon: PokemonInstance }>
    ) => {
      state.pokemon[action.payload.index] = action.payload.pokemon;
    },
    healPokemon: (state) => {
      // Heal
      for (let i = 0; i < state.pokemon.length; i++) {
        state.pokemon[i].hp = getPokemonStats(
          state.pokemon[i].id,
          state.pokemon[i].level
        ).hp;
        for (let j = 0; j < state.pokemon[i].moves.length; j++) {
          state.pokemon[i].moves[j].pp =
            getMoveMetadata(state.pokemon[i].moves[j].id).pp || 0;
        }
      }
    },
    recoverFromFainting: (state) => {
      // Heal
      for (let i = 0; i < state.pokemon.length; i++) {
        state.pokemon[i].hp = getPokemonStats(
          state.pokemon[i].id,
          state.pokemon[i].level
        ).hp;
        for (let j = 0; j < state.pokemon[i].moves.length; j++) {
          state.pokemon[i].moves[j].pp =
            getMoveMetadata(state.pokemon[i].moves[j].id).pp || 0;
        }
      }

      // Move
      const getRecoverLocation = (map: MapId): { map: MapId; pos: PosType } => {
        const mapData_ = mapData[map];
        if (mapData_.recoverLocation) {
          return { map, pos: mapData_.recoverLocation };
        }
        if (!mapData_.exitReturnMap) throw new Error("No exit return map");
        return getRecoverLocation(mapData_.exitReturnMap);
      };
      const { map, pos } = getRecoverLocation(state.map);
      state.map = map;
      state.pos = pos;
    },
    resetActivePokemon: (state) => {
      let fistIndexWithHp = 0;
      for (let i = 0; i < state.pokemon.length; i++) {
        if (state.pokemon[i].hp > 0) {
          fistIndexWithHp = i;
          break;
        }
      }
      state.activePokemonIndex = fistIndexWithHp;
    },
    addPokemon: (state, action: PayloadAction<PokemonInstance>) => {
      if (state.pokemon.length === 6) {
        state.pc.push(action.payload);
        return;
      }
      state.pokemon.push(action.payload);
    },
    stopJumping: (state) => {
      state.jumping = false;
    },
    depositPokemonToPc: (state, action: PayloadAction<number>) => {
      const pokemon = state.pokemon.splice(action.payload, 1);
      state.pc.push(pokemon[0]);
    },
    withdrawPokemonFromPc: (state, action: PayloadAction<number>) => {
      if (state.pokemon.length === 6) throw new Error("No space in party");
      const pokemon = state.pc.splice(action.payload, 1);
      state.pokemon.push(pokemon[0]);
    },
    gainMoney: (state, action: PayloadAction<number>) => {
      state.money += action.payload;
    },
    takeMoney: (state, action: PayloadAction<number>) => {
      state.money -= action.payload;
    },
    encounterTrainer: (state, action: PayloadAction<TrainerType>) => {
      state.trainerEncounter = action.payload;
    },
    defeatTrainer: (state) => {
      if (!state.trainerEncounter) throw new Error("No trainer encounter");
      const id = `${state.map}-${state.trainerEncounter.pos.x}-${state.trainerEncounter.pos.y}`;
      state.defeatedTrainers.push(id);
      state.trainerEncounter = undefined;
    },
    faintToTrainer: (state) => {
      state.trainerEncounter = undefined;
    },
    collectItem: (state, action: PayloadAction<MapItemType>) => {
      const id = `${state.map}-${action.payload.pos.x}-${action.payload.pos.y}`;
      state.collectedItems.push(id);
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      state.completedQuests.push(action.payload);
    },
  },
});

export const {
  initializeName,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  setMap,
  setPos,
  setMapWithPos,
  exitMap,
  setMoving,
  addInventory,
  healPokemon,
  removeInventory,
  consumeItem,
  setName,
  save,
  load,
  swapPokemonPositions,
  encounterPokemon,
  endEncounter,
  setActivePokemon,
  updatePokemonEncounter,
  updatePokemon,
  updateSpecificPokemon,
  recoverFromFainting,
  resetActivePokemon,
  addPokemon,
  stopJumping,
  depositPokemonToPc,
  withdrawPokemonFromPc,
  gainMoney,
  takeMoney,
  encounterTrainer,
  defeatTrainer,
  faintToTrainer,
  collectItem,
  completeQuest,
} = gameSlice.actions;

export const selectPos = (state: RootState) => state.game.pos;

export const selectMap = (state: RootState) => mapData[state.game.map];

export const selectDirection = (state: RootState) => state.game.direction;

export const selectMoving = (state: RootState) => state.game.moving;

export const selectInventory = (state: RootState) => state.game.inventory;

export const selectMoney = (state: RootState) => state.game.money;

export const selectPreviousMap = (state: RootState) => {
  const returnMap = mapData[state.game.map].exitReturnMap;
  if (!returnMap) return null;
  return mapData[returnMap];
};

export const selectName = (state: RootState) => state.game.name;

export const selectHasSave = (state: RootState) => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(state.game.name) !== null;
  } catch {
    return false;
  }
};


export const selectPokemon = (state: RootState) => state.game.pokemon;

export const selectPokemonEncounter = (state: RootState) =>
  state.game.pokemonEncounter;

export const selectActivePokemon = (state: RootState) =>
  state.game.pokemon[state.game.activePokemonIndex];

export const selectJumping = (state: RootState) => state.game.jumping;

export const selectPc = (state: RootState) => state.game.pc;

export const selectTrainerEncounter = (state: RootState) =>
  state.game.trainerEncounter;

export const selectDefeatedTrainers = (state: RootState) =>
  state.game.defeatedTrainers;

export const selectMapId = (state: RootState) => state.game.map;

export const selectCollectedItems = (state: RootState) =>
  state.game.collectedItems;

export const selectCompletedQuests = (state: RootState) =>
  state.game.completedQuests;

export const selectActivePokemonIndex = (state: RootState) =>
  state.game.activePokemonIndex;

export default gameSlice.reducer;
