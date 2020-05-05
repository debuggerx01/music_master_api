import wrap from "../helpers/catchWrapper";
import { NextFunction, Request, Response } from "express";
import { redis } from "../helpers/redis";
import { shuffle } from "../helpers/utility";
import { Bonus, BONUS_TYPE, Result } from "../models/result";
import buildBonus from "../helpers/bonusRules";
import History from "../models/history";
import Customer from "../models/customer";
import { buildMasterTag, getRandomQuestions } from "../helpers/tagUtils";
import Tags from "../models/tags";

export default class Questions {
  /**
   * @api {get} /questions 题目列表
   * @apiPermission none
   * @apiVersion 1.0.0
   * @apiName Questions.index
   * @apiGroup Questions
   *
   * @apiSuccess [{content: string, options: [{content: string}]}] questions questions
   * @apiSuccessExample Success-Response:
   *     Status: 200 OK
   *     [
   *       {
   *         content: "question1",
   *         options: [
   *           {
   *             content: "option1"
   *           }
   *         ]
   *       },
   *     ]
   */
  static index = wrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { customer } = req.context;
      const cid = customer.id;

      const qids: number[] = await getRandomQuestions(cid);
      const promises = [];
      for (const id of qids) {
        promises.push(redis.lindex("mm:questions", id - 1));
      }
      return Promise.all(promises).then(async questions => {
        const answers = [];
        questions = questions.map(q => {
          q = JSON.parse(q);
          q.options = shuffle(q.options);
          for (let i = 0; i < q.options.length; i++) {
            if (q.options[i].correct) {
              answers.push({
                correct: i,
                tags: q.tags,
              });
              if (process.env.NODE_ENV !== "production") {
                q.options[i].content += " √";
              }
            }
            delete q.options[i].correct;
          }
          delete q.tags;
          return q;
        });
        await redis.set(`mm:processing:${cid}:answers`, JSON.stringify(answers), "EX", 600);
        await redis.set(`mm:processing:${cid}:process`, "");
        return res.json(questions);
      });

    }
  );


  /**
   * @api {post} /questions/answer 作答
   * @apiPermission none
   * @apiVersion 1.0.0
   * @apiName Questions.answer
   * @apiGroup Questions
   *
   * @apiParam {Number} qIndex 题目序号
   * @apiParam {Number} oIndex 选项序号
   * @apiParam {Number} time   答题耗时
   *
   * @apiSuccess {} result result
   * @apiSuccessExample Success-Response:
   *     Status: 200 OK
   *     {
   *       totalPoint: 100,
   *       plusPoint: 10,
   *       bonus: [
   *         {
   *           type: "CORRECT",
   *           arg: 3,
   *           point: 10
   *         }
   *       ],
   *     }
   */
  static answer = wrap(
    async (req: Request, res: Response) => {
      const { qIndex, oIndex, time, process, correctOption, customer: { id } } = req.context;
      let fullCombo = false;
      const pre = process.length ? process[process.length - 1] : ({
        totalPoint: 0,
        plusPoint: 0,
      } as Result);
      let result;
      let tags: Tags;
      if (correctOption === oIndex) {
        const bonus = buildBonus(time, [...process].reverse());
        let plusPoint = 40;
        bonus.forEach((b: Bonus) => {
          plusPoint += b.point;
          if (b.type === BONUS_TYPE.CORRECT && b.arg === 10) {
            fullCombo = true;
          }
        });
        result = new Result({
          correctOption,
          time,
          totalPoint: pre.totalPoint + plusPoint,
          plusPoint: plusPoint,
          bonus,
        });
        tags = JSON.parse(await redis.get(`mm:processing:${id}:tags`));
        for (const tag of req.context.tags) {
          if (!tags.counts[tag]) {
            tags.counts[tag] = 0;
          }
          tags.counts[tag]++;
        }
        await redis.set(`mm:processing:${id}:tags`, JSON.stringify(tags));
      } else {
        result = { ...pre, correctOption, plusPoint: 0, bonus: null };
      }
      process.push(result);
      if (qIndex === 9) {
        if (!tags) {
          tags = JSON.parse(await redis.get(`mm:processing:${id}:tags`));
        }
        const correctCount = process.filter(p => p.plusPoint).length;
        let master = fullCombo ? "全能型" : (correctCount <= 3 ? "音痴型" : buildMasterTag(tags));
        if (master === "音痴型") {
          master += `/${correctCount}`;
        }
        result.master = master;
        await History.saveHistory(id, result.totalPoint, process);
        await Customer.updateHighScore(id, result.totalPoint, result.master);
      } else {
        await redis.set(`mm:processing:${id}:process`, JSON.stringify(process), "EX", 300);
      }
      return res.json(result);
    }
  );
}
