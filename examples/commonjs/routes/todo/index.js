/* eslint-disable @typescript-eslint/no-var-requires */
const { emptyMiddleware, sendResponse } = require('../../middleware');

exports.get = [emptyMiddleware, sendResponse];
exports.put = sendResponse;
