class Result {
  constructor({ totalPoint = 0, plusPoint = 0, time, correctOption, bonus = [] }) {
    this.totalPoint = totalPoint;
    this.plusPoint = plusPoint;
    this.time = time;
    this.correctOption = correctOption;
    this.bonus = bonus;
  }

  totalPoint: number;
  plusPoint: number;
  bonus: Bonus[];
  correctOption: number;
  time: number;
}

enum BONUS_TYPE {
  // 正确率
  CORRECT = "CORRECT",
  // 速度
  SPEED = "SPEED",
  // 连续快速答对(2秒内)
  MIX_WITHIN_TWO = "MIX_WITHIN_TWO",
  // 连续快速答对(2~3秒内)
  MIX_TWO_TO_WHREE = "MIX_TWO_TO_WHREE",
}

class Bonus {
  constructor(type: BONUS_TYPE, arg: number, point: number) {
    this.type = type;
    this.arg = arg;
    this.point = point;
  }

  type: BONUS_TYPE;
  arg: number;
  point: number;
}

export { Result, BONUS_TYPE, Bonus };