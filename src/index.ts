import { Router } from 'express';
import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { Dirent } from 'fs';

async function getFiles(dirName: string): Promise<number> {
  const dirents = await readdir(dirName, { withFileTypes: true });

  const files = await Promise.all(
    dirents.map((dirent: Dirent) => {
      const res = resolve(dirName, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );

  return Array.prototype.concat(...files);
}

function genPath(dirName: string, file: string): string {
  let path = file.split(dirName)[1];

  if (path.endsWith('index.js')) {
    path = path.split('index.js')[0];
  } else if (path.endsWith('index.ts')) {
    path = path.split('index.ts')[0];
  } else if (path.endsWith('.js')) {
    path = path.split('.js')[0];
  } else if (path.endsWith('.ts')) {
    path = path.split('.ts')[0];
  }

  return path;
}

async function createDirRouter(dirNameRaw: string): Promise<Router> {
  const dirName = dirNameRaw.startsWith('./')
    ? dirNameRaw.split('./').filter(i => !!i)[0]
    : dirNameRaw;

  const router = Router();

  const files = await getFiles(dirName);

  files.forEach(async (file: string) => {
    const moduleRaw = await import(file);
    const module = moduleRaw.default ? moduleRaw.default : moduleRaw;

    Object.keys(module).map((modExport: string) => {
      try {
        const path = genPath(dirName, file);
        const modExportMw = module[modExport];
        const modExportMwArray = Array.isArray(modExportMw)
          ? modExportMw
          : [modExportMw];
        // @ts-expect-error: Cannot find proper type for route
        router[modExport](path, ...modExportMwArray);
      } catch (error) {
        console.log(
          `ERROR:express-directory-router\n\t[METHOD] ${modExport}\n\t[FILE] ${file}\n\t[MESSAGE] Failed to create route`,
        );
      }
    });
  });

  return router;
}

export default createDirRouter;
