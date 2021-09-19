import { sendResponse } from '../../middleware';

const get = sendResponse;
const post = sendResponse;
// Since delete is a reserved keyword, recommend using something else like this
const deleteController = sendResponse;

export default {
  get,
  post,
  delete: deleteController,
};
