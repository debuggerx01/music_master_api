import ApiError from "./apiError";
import * as HTTPStatus from "http-status";

export default class NotFoundApiError extends ApiError {
  constructor() {
    super(10002, HTTPStatus.NOT_FOUND);
  }
}
