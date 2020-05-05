import jwtUtil from "../helpers/jwtUtil";
import wrap from "../helpers/catchWrapper";
import Customer from "../models/customer";
import UnauthorizedApiError from "../errors/unauthorizedApiError";

export default (getCustomer = false, throwError = true) => {
  return wrap(async (req, res, next) => {
    const data = jwtUtil.verify(req);

    let pass = false;

    if (data) {
      req.context.userId = data.id;
      pass = true;
      if (getCustomer) {
        req.context.customer = await Customer.getCustomer(req.context.userId);
        if (!req.context.customer) {
          pass = false;
        }
      }
    }

    if (!pass && throwError) {
      throw new UnauthorizedApiError();
    }

    next();
  });
};
