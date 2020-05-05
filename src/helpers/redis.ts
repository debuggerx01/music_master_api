import * as config from "config";
import * as Redis from "ioredis";

const redis = new Redis(config.get("redis"));

export { redis };
