import { createLogger, LoggerOptions } from "bunyan";

const config: LoggerOptions = {
  name: "247tickets",
  streams: [
    {
      level: "info",
      stream: process.stdout
    },
    {
      level: "trace",
      stream: process.stdout
    },
    {
      level: "debug",
      stream: process.stderr
    },
    {
      type: "rotating-file",
      level: "error",
      path: "logs/error.log",
      period: "1d",
      count: 7
    }
  ]
};

export default createLogger(config);
