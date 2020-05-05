import ApiError from "./apiError";
import * as HTTPStatus from "http-status";

export default class ServiceUnavailableApiError extends ApiError {
  constructor(code = 10000) {
    super(code, HTTPStatus.SERVICE_UNAVAILABLE);
  }
}
