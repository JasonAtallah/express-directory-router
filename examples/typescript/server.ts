import * as express from 'express';
import { createDirRouter } from '../../lib';

async function runApp(): Promise<void> {
  const app = express();

  const routes = await createDirRouter('routes');

  app.use(routes);
  app.listen(3000, () => console.log('Magic happening on port 3000'));
}

runApp();
