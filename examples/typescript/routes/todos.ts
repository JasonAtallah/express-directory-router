import { emptyMiddleware, sendResponse } from '../middleware';

export const get = sendResponse;
export const post = [emptyMiddleware, sendResponse];
// Not a valid http method, will log error at runtime
export const thisIsNotAValidMethod = sendResponse;
