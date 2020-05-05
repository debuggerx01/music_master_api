import { Bonus, BONUS_TYPE, Result } from "../models/result";
import { getRandomInt } from "./utility";

type BONUS_FUNC = (time: number, process: Result[]) => Bonus | null;

const bonusCorrect = (time: number, process: Result[]) => {
  let times = process.findIndex(result => result.plusPoint === 0) + 1;
  times = times || process.length + 1;
  let plusPoint;
  switch (times) {
    case 3:
    case 5:
      plusPoint = 10;
      break;
    case 8:
      plusPoint = 20;
      break;
    case 9:
      plusPoint = 30;
      break;
    case 10:
      plusPoint = 50;
      break;
    default:
      return null;
  }
  return new Bonus(BONUS_TYPE.CORRECT, times, plusPoint);
};

const bonusSpeed = (time: number, process: Result[]) => {
  let plusPoint = 0;
  if (time <= 2) {
    plusPoint = getRandomInt(70, 80);
  } else if (time <= 2.5) {
    plusPoint = getRandomInt(60, 70);
  } else if (time <= 3) {
    plusPoint = getRandomInt(50, 60);
  } else if (time <= 3.5) {
    plusPoint = getRandomInt(45, 50);
  } else if (time <= 4) {
    plusPoint = getRandomInt(35, 45);
  } else if (time <= 5) {
    plusPoint = getRandomInt(25, 35);
  } else if (time <= 6) {
    plusPoint = getRandomInt(10, 25);
  }
  if (plusPoint) {
    return new Bonus(BONUS_TYPE.SPEED, time, plusPoint);
  } else {
    return null;
  }
};

const bonusMix = (time: number, process: Result[]) => {
  let times;
  if (time <= 2) {
    times = process.findIndex(result => result.plusPoint === 0 || result.time > 2) + 1;
    times = times || process.length + 1;
    if (times >= 3) {
      return new Bonus(BONUS_TYPE.MIX_WITHIN_TWO, times, times + times === 10 ? 2 : 1);
    }
  } else if (time <= 3) {
    times = process.findIndex(result => result.plusPoint === 0 || result.time > 3) + 1;
    times = times || process.length + 1;
    if (times >= 3) {
      return new Bonus(BONUS_TYPE.MIX_TWO_TO_WHREE, times, times - 1);
    }
  }
  return null;
};

const BONUS_FUNCS = [
  bonusCorrect,
  bonusSpeed,
  bonusMix,
];

const buildBonus = (time: number, process: Result[]) => {
  const bonus = [];
  BONUS_FUNCS.forEach((func: BONUS_FUNC) => {
    const b = func(time, process);
    if (b) {
      bonus.push(b);
    }
  });
  return bonus;
};

export default buildBonus;