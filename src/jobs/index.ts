import { CronJob } from "cron";
import asyncQuestions from "./asyncQuestions";

const jobs: Array<CronJob> = [];
const run = () => {
  const tasks = [asyncQuestions];

  for (const task of tasks) {
    jobs.push(new CronJob(task));
  }
};

export default run;
