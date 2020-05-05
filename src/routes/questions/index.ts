import * as express from "express";
import Questions from "../../controllers/questions";
import jwt from "../../middlewares/jwt";
import indexValidation from "./indexValidation";
import answerValidation from "./answerValidation";

export default (router: express.Router): void => {
  router.post(
    "/questions/answer",
    jwt(true, true),
    answerValidation(),
    Questions.answer
  );
  router.get(
    "/questions",
    jwt(true, true),
    indexValidation(),
    Questions.index
  );
};
