import { useDispatch, useSelector } from "react-redux";
import { Event } from "../app/emitter";
import useEvent from "../app/use-event";
import {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  setMoving,
} from "../state/gameSlice";
import { useEffect, useRef, useState } from "react";
import { selectFrozen, selectSpinning } from "../state/uiSlice";
import { MOVE_SPEED } from "../app/constants";
import { Direction } from "../state/state-types";

const MovementHandler = () => {
  const dispatch = useDispatch();
  const [pressingLeft, setPressingLeft] = useState(false);
  const [pressingRight, setPressingRight] = useState(false);
  const [pressingUp, setPressingUp] = useState(false);
  const [pressingDown, setPressingDown] = useState(false);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const spinning = useSelector(selectSpinning);
  const frozen = useSelector(selectFrozen);

  const pressingButton =
    pressingLeft || pressingRight || pressingUp || pressingDown;

  useEffect(() => {
    dispatch(setMoving(pressingButton));
  }, [pressingButton, dispatch]);

  const direction = pressingLeft
    ? Direction.Left
    : pressingRight
    ? Direction.Right
    : pressingUp
    ? Direction.Up
    : Direction.Down;

  useEffect(() => {
    const move = (direction: Direction) => {
      switch (spinning ?? direction) {
        case Direction.Down:
          dispatch(moveDown());
          break;
        case Direction.Up:
          dispatch(moveUp());
          break;
        case Direction.Left:
          dispatch(moveLeft());
          break;
        case Direction.Right:
          dispatch(moveRight());
          break;
      }
    };

    // If moving, move the character immediately
    if ((pressingButton || spinning) && !cooldown && !frozen) {
      move(direction);
      setCooldown(true);

      // Clear any existing interval
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }

      // Set up a new interval with faster initial response
      tickIntervalRef.current = setInterval(() => {
        move(direction);
      }, MOVE_SPEED);

      // Much shorter cooldown for instant responsive movement
      setTimeout(() => setCooldown(false), MOVE_SPEED * 0.5);
    } else if (!pressingButton && !spinning && tickIntervalRef.current) {
      // Clear the interval if the user stopped moving
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }

    return () => {
      // Clear interval when component unmounts
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressingButton, direction, dispatch, cooldown, frozen, spinning]);

  useEvent(Event.StartDown, () => {
    setPressingDown(true);
  });
  useEvent(Event.StartUp, () => {
    setPressingUp(true);
  });
  useEvent(Event.StartLeft, () => {
    setPressingLeft(true);
  });
  useEvent(Event.StartRight, () => {
    setPressingRight(true);
  });

  useEvent(Event.StopDown, () => {
    setPressingDown(false);
  });
  useEvent(Event.StopUp, () => {
    setPressingUp(false);
  });
  useEvent(Event.StopLeft, () => {
    setPressingLeft(false);
  });
  useEvent(Event.StopRight, () => {
    setPressingRight(false);
  });
  useEvent(Event.StopMoving, () => {
    setPressingLeft(false);
    setPressingRight(false);
    setPressingUp(false);
    setPressingDown(false);
  });

  return null;
};

export default MovementHandler;
