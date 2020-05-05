const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const shuffle = (arr: any[]) => {
  return arr.sort(() => getRandomInt(-1, 1));
};

export { getRandomInt, shuffle };
