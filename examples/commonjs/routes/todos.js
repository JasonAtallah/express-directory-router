const { emptyMiddleware, sendResponse } = require('../middleware');

exports.get = sendResponse;
exports.post = [emptyMiddleware, sendResponse];
// Not a valid http method, will log error at runtime
exports.thisIsNotAValidMethod = sendResponse;
