import ApiError from "../errors/apiError";
import ServiceUnavailableApiError from "../errors/serviceUnavailableApiError";
import UnprocessableEntityApiError from "../errors/unprocessableEntityApiError";
import logger from "../helpers/logger";
import { Request, Response, NextFunction } from "express";

export default () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    let newErr: any = err;
    if (!(err instanceof ApiError)) {
      newErr = new ServiceUnavailableApiError();
      logger.error(err);
    }

    const body: any = {
      message: newErr.getMessage("zh")
    };

    if (newErr instanceof UnprocessableEntityApiError) {
      body.code = newErr.code;
    }

    res.status(newErr.status).json(body);
  };
};
