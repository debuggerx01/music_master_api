import fetchQuestions from "../helpers/fetchQuestions";

const onTick = async () => {
  await fetchQuestions();
};

// run full sync at 2am every day
export default {
  cronTime: "0 5 0 * * *",
  onTick: onTick,
  start: true,
  timeZone: "Asia/Shanghai"
};
