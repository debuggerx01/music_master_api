import * as moment from "moment-timezone";
import wrap from "../helpers/catchWrapper";
import * as config from "config";

export default () => {
  return wrap(async (req, res, next) => {
    req.context = {};
    next();
  });
};
