/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const { createDirRouter } = require('../../lib');

const runApp = async () => {
  const app = express();

  const routes = await createDirRouter('routes');

  app.use(routes);
  app.listen(3000, () => console.log('Magic happening on port 3000'));
};

runApp();
