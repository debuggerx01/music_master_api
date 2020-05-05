import ApiError from "./apiError";
import * as HTTPStatus from "http-status";

export default class UnauthorizedApiError extends ApiError {
  constructor() {
    super(10001, HTTPStatus.UNAUTHORIZED);
  }
}
