export enum ErrorCodes {
  SUCCESS,
  NO_RESULT,
  EMPTY_BODY,
  MIN_COUNT_GREATER,
  START_DATE_GREATER,
  INVALID_BODY,
}
export const SUCCESS = {
  code: ErrorCodes.SUCCESS,
  msg: 'Success',
};
export const NO_RESULT = {
  code: ErrorCodes.NO_RESULT,
  msg: 'No results found',
};
export const EMPTY_BODY = {
  code: ErrorCodes.EMPTY_BODY,
  msg: 'Body is empty',
};
export const MIN_COUNT_GREATER = {
  code: ErrorCodes.MIN_COUNT_GREATER,
  msg: 'Min count is greater than max count',
};
export const START_DATE_GREATER = {
  code: ErrorCodes.START_DATE_GREATER,
  msg: 'Start date is greater than max count',
};
export const INVALID_BODY = {
  code: ErrorCodes.INVALID_BODY,
  msg: 'Body is invalid',
};
