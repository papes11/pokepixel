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
          {
            label: "Pokepixel",
            action: () => {
              if (allPokemon.length === 0) return;
              setPokemon(true);
            },
          },
          {
            label: "Quest Box",
            action: () =>
              dispatch(
                showText([
                  "✨ Pokepixel Box Info ✨",
                  "ALL ITEMS WILL BE SHOWN IN BETA.",
                  "Stay tuned for more updates!",
                ])
              ),
          },
          {
            label: "Player",
            action: () => dispatch(showPlayerMenu()),
          },
          {
            label: "Item",
            action: () => dispatch(showItemsMenu()),
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
        ]}
      />
      {pokemon && <PokemonList close={() => setPokemon(false)} />}
    </>
  );
};

export default StartMenu;
