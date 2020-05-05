import jwtUtil from "../helpers/jwtUtil";
import wrap from "../helpers/catchWrapper";

export default id => {
  return wrap(async (req, res, next) => {
    if (!["produciton", "test", "staging"].includes(process.env.NODE_ENV)) {
      req.query.access_token = jwtUtil.sign(id);
    }
    next();
  });
};
