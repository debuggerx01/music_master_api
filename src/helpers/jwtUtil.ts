import * as jwt from "jsonwebtoken";
import * as config from "config";

const sign = (id, expiresIn = "20 days") => {
  return jwt.sign({ id }, config.get("auth.jwt.secret"), {
    expiresIn: expiresIn
  });
};

const verify = (req): any => {
  let token = undefined;
  let parts = req.get("Authorization");

  if (parts) {
    parts = parts.split(" ");
    if (parts.length == 2) {
      if (/^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }
  }

  if (!token) {
    if (req.query && req.query.access_token) {
      token = req.query.access_token;
    }
  }

  if (token) {
    try {
      return jwt.verify(token, config.get("auth.jwt.secret"));
    } catch (err) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export default { sign, verify };
