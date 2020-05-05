import { sprintf } from "sprintf-js";

export default class ApiError extends Error {
  public code: number;
  public status: number;
  public data: any;
  constructor(code = 10000, status = 503, data: any = {}) {
    super("");

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // additional properties.
    this.code = code;
    this.status = status;
    this.data = data;
  }

  getMessage(lang: string) {
    const messages = require("./langs/" + lang + "/error").default;
    const message = messages[this.code] || messages[10000];

    if (this.data && Array.isArray(this.data) && this.data.length > 0) {
      return sprintf(message, ...this.data);
    }

    return message;
  }
}
