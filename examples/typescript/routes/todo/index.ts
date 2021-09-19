import { emptyMiddleware, sendResponse } from '../../middleware';

export const get = [emptyMiddleware, sendResponse];
export const put = sendResponse;
