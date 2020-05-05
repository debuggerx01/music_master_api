import wrap from "../../helpers/catchWrapper";
import UnprocessableEntityApiError from "../../errors/unprocessableEntityApiError";
import { NextFunction, Request, Response } from "express";
import { redis } from "../../helpers/redis";

export default () =>
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const { qIndex, oIndex, time } = req.body;
    let process: any = await redis.get(`mm:processing:${req.context.customer.id}:process`);
    if (process) {
      process = JSON.parse(process);
    } else {
      process = [];
    }
    if (process.length === qIndex && qIndex < 10) {
      req.context.qIndex = qIndex;
      req.context.oIndex = oIndex;
      req.context.time = time;
      req.context.process = process;
      const answers = JSON.parse(await redis.get(`mm:processing:${req.context.customer.id}:answers`));
      req.context.correctOption = answers[qIndex].correct;
      req.context.tags = answers[qIndex].tags;
      next();
    } else {
      throw new UnprocessableEntityApiError(20151);
    }
  });
