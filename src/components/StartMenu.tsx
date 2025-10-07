import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import {
  hideStartMenu,
  selectConfirmationMenu,
  selectStartMenu,
  selectStartMenuSubOpen,
  showConfirmationMenu,
  showItemsMenu,
  showPlayerMenu,
  showStartMenu,
  showText,
} from "../state/uiSlice";
import useEvent from "../app/use-event";
import emitter, { Event } from "../app/emitter";
import { useState } from "react";
import { save, selectName, selectPokemon } from "../state/gameSlice";
import PokemonList from "./PokemonList";

const StartMenu = () => {
  const dispatch = useDispatch();
  const show = useSelector(selectStartMenu);
  const disabled = useSelector(selectStartMenuSubOpen);
  const name = useSelector(selectName);
  const saving = !!useSelector(selectConfirmationMenu);
  const allPokemon = useSelector(selectPokemon);

  const [pokemon, setPokemon] = useState(false);

  useEvent(Event.Start, () => {
    dispatch(showStartMenu());
    emitter.emit(Event.StopMoving);
  });

  return (
    <>
      <Menu
        disabled={disabled || saving || pokemon}
        show={show}
        close={() => dispatch(hideStartMenu())}
        menuItems={[
          // {
          //   label: "Pokédex",
          //   action: () => console.log("TODO"),
          // },
          {
            label: "Pokepixel",
            action: () => {
              if (allPokemon.length === 0) return;
              setPokemon(true);
            },
          },
          {
            label: "Item",
            action: () => dispatch(showItemsMenu()),
          },

          {
            label: "Player",
            action: () => dispatch(showPlayerMenu()),
          },
          {
            label: "Save",
            action: () => {
              dispatch(
                showConfirmationMenu({
                  preMessage: "Would you like to SAVE the game?",
                  postMessage: `${name} saved the game!`,
                  confirm: () => {
                    dispatch(save());
                    return Promise.resolve(true);
                  },
                })
              );
            },
          },

          {
            label: "faq",
            action: () =>
              dispatch(
                showText([
                  "✨ Pokepixel FAQ ✨",

                  "🎮 What is Pokepixel?",

                  "Pokepixel is a free-to-play, ",

                  "On solana blockchain,",

                  "play-to-earn game where you explore,",

                  "and find hidden quest boxes.",

                  "🧩 How do I play?",

                  "Connect wallet Hold 10k pokepixel",

                  "and Start playing now",

                  "Roam the world map,",

                  "Hidden boxes spawn randomly",

                  "collect quest boxes items",

                  "and level up your airdrop",

                  "giving you rewards and surprises!",

                  "🚀 What phase are we in?",

                  "AlphaNet is OPEN — ",

                  "join and be part of something huge.",

                  "🎁 What’s coming next?",

                  "- Massive airdrops for early players",

                  "- Swap features in BetaNet",

                  "- More quests and  hidden box events",

                  "🔥 Don’t wait! Start your journey,",

                  "find quest boxes, and claim your rewards!",

                  "only on solana blockchain",

                  "alphanet is open now!",

                  "Social links updating soon!",
                ])
              ),
          },

          {
            label: "box",
            action: () =>
              dispatch(
                showText([
                  "✨ Pokepixel Box Info ✨",
                  "ALL ITEM WILL NE SHOWN IN BETA",
                  "Stay tuned for more updates!",

                ])
                ),
          },
        ]}
      />
      {pokemon && <PokemonList close={() => setPokemon(false)} />}
    </>
  );
};

export default StartMenu;
