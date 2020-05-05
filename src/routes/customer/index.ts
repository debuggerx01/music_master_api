import * as express from "express";
import Customer from "../../controllers/customer";
import loginValidation from "./loginValidation";
import jwt from "../../middlewares/jwt";

export default (router: express.Router): void => {
  router.post(
    "/customers/login",
    jwt(true, false),
    loginValidation(),
    Customer.login
  );
  router.get(
    "/customers/play-count",
    jwt(true, true),
    Customer.playCount
  );
  router.get(
    "/customers/ranking",
    jwt(true, true),
    Customer.ranking
  );
};
