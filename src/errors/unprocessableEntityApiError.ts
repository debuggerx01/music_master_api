import ApiError from "./apiError";
import * as HTTPStatus from "http-status";

export default class UnprocessableEntityApiError extends ApiError {
  constructor(code: number, data: any = {}) {
    super(code, HTTPStatus.UNPROCESSABLE_ENTITY, data);
  }
}
