import wrap from "../../helpers/catchWrapper";
import History from "../../models/history";
import UnprocessableEntityApiError from "../../errors/unprocessableEntityApiError";
import { NextFunction, Request, Response } from "express";

export default () =>
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    if (await History.canPlayToday(req.context.customer.id)) {
      next();
    } else {
      throw new UnprocessableEntityApiError(20150);
    }
  });
