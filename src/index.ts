import { Router } from 'express';
import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { Dirent } from 'fs';

const getFiles = async (dirName: string): Promise<string[]> => {
  const dirents = await readdir(dirName, { withFileTypes: true });

  const files = await Promise.all(
    dirents.map(async (dirent: Dirent): Promise<string | string[]> => {
      const res = resolve(dirName, dirent.name);

      if (dirent.isDirectory()) {
        return await getFiles(res);
      }

      return res;
    }),
  );

  return Array.prototype.concat(...files);
};

const genPath = (dirName: string, file: string): string => {
  let path = file.split(dirName)[1];

  ['index.js', 'index.ts', '.js', '.ts'].forEach(end => {
    if (path.endsWith(end)) {
      path = path.split(end)[0];
    }
  });

  return path;
};

const getDirName = (dirNameRaw: string): string =>
  dirNameRaw.startsWith('./')
    ? dirNameRaw.split('./').filter(i => !!i)[0]
    : dirNameRaw;

const getModExportMw = (modExportMw: string): string[] =>
  Array.isArray(modExportMw) ? modExportMw : [modExportMw];

const registerRoutes = async (
  file: string,
  dirName: string,
  router: Router,
): Promise<void> => {
  const moduleRaw = await import(file);
  const module = moduleRaw.default ? moduleRaw.default : moduleRaw;
  const path = genPath(dirName, file);

  function registerRoute(modExport: string): void {
    try {
      const modExportMwArray = getModExportMw(module[modExport]);
      // @ts-expect-error: TODO, find type from express
      router[modExport](path, ...modExportMwArray);
    } catch (error) {
      console.log(
        `[express-directory-router] Failed to create route for ${modExport} in ${file}`,
      );
    }
  }

  Object.keys(module).forEach(registerRoute);
};

const createDirRouter = async (dirNameRaw: string): Promise<Router> => {
  const router = Router();

  const dirName = getDirName(dirNameRaw);
  const files = await getFiles(dirName);
  await Promise.all(files.map(file => registerRoutes(file, dirName, router)));

  return router;
};

export { createDirRouter };
