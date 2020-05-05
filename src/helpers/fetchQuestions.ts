import Questions from "../models/questions";
import Options from "../models/options";
import { redis } from "./redis";
import { tagList, tagIndex } from "./tagUtils";

const fetchQuestions = async () => {
  const questions = await Questions.getQuestions();
  const options = await Options.getOptions();
  let res = [];
  const tags = [];
  for (let i = 0; i < tagList.length; i++) {
    tags[i] = [];
  }
  options.forEach((option => {
    const qid = option.get("questionId");
    if (!res[qid]) {
      const question = questions.get(qid);
      res[qid] = {
        content: question.get("content"),
        tags: question.get("tags").split("/"),
      };
      res[qid].options = [];
      for (const tag of res[qid].tags) {
        tags[tagIndex(tag)].push(qid);
      }
    }
    res[qid].options.push(option.toJSON());
  }));
  res = res.filter(i => i).map(i => JSON.stringify(i));
  redis.del("mm:questions").then(() => {
    redis.rpush("mm:questions", ...res);
    for (let i = 0; i < tagList.length; i++) {
      redis.sadd(`mm:questions:tag${i}`, ...tags[i]);
    }
  });
};

export default fetchQuestions;