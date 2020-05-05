import * as express from "express";
import customer from "./customer";
import questions from "./questions";

function test(req, res) {
  return res.json({ code: 200 });
}


export default function (): express.Router {
  const router = express.Router();
  router.get("/test/", test);
  customer(router);
  questions(router);
  return router;
}
