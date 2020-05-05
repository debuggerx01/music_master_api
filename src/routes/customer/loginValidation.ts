import wrap from "../../helpers/catchWrapper";
import Customer from "../../models/customer";
import UnprocessableEntityApiError from "../../errors/unprocessableEntityApiError";
import { Request, Response, NextFunction } from "express";

export default () =>
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.context.customer) {
      const { unionId, openId, nickName, avatar } = req.body;

      req.check({
        unionId: {
          in: "body",
          notEmpty: true,
          errorMessage: 20021
        },
        openId: {
          in: "body",
          notEmpty: true,
          errorMessage: 20022
        },
        nickName: {
          in: "body",
          notEmpty: true,
          errorMessage: 20023
        },
        avatar: {
          in: "body",
          notEmpty: true,
          errorMessage: 20024
        }
      });

      const errors = req.validationErrors();

      if (Array.isArray(errors) && errors.length > 0) {
        throw new UnprocessableEntityApiError(errors[0].msg);
      }

      const customer = await Customer.getCustomerByUnionId(unionId);

      req.context = {
        ...req.context,
        unionId,
        openId,
        nickName,
        avatar,
        customer
      };
    }

    next();
  });
