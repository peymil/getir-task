export enum ErrorCodes {
  SUCCESS,
  NO_RESULT,
  INVALID_BODY,
  EMPTY_BODY,
}
export const SUCCESS = {
  code: ErrorCodes.SUCCESS,
  msg: 'Success',
};
export const NO_RESULT = {
  code: ErrorCodes.NO_RESULT,
  msg: 'No results found',
};
export const INVALID_BODY = {
  code: ErrorCodes.INVALID_BODY,
  msg: 'Body values are not valid',
};
export const EMPTY_BODY = {
  code: ErrorCodes.EMPTY_BODY,
  msg: 'Body is empty',
};
