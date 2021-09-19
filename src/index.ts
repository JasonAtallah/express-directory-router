import { Router } from 'express';
import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { Dirent } from 'fs';

export const createDirRouter = async (dirNameRaw: string): Promise<Router> => {
  const router = Router();

  const dirName = dirNameRaw.split('./').filter(i => !!i)[0];
  const files = await getFiles(dirName);
  await Promise.all(files.map(file => registerRoutes(file, dirName, router)));

  return router;
};

const genPath = (dirName: string, file: string): string =>
  file
    .split(dirName)[1]
    .split(
      ['index.js', 'index.ts', '.js', '.ts'].find(i => file.endsWith(i)) || '',
    )[0];

const getModExportMw = (modExportMw: string): string[] =>
  Array.isArray(modExportMw) ? modExportMw : [modExportMw];

const getFilesFromDirent = async (
  dirent: Dirent,
  dirName: string,
): Promise<string | string[]> => {
  const res = resolve(dirName, dirent.name);

  if (dirent.isDirectory()) {
    return await getFiles(res);
  }

  return res;
};

const getFiles = async (dirName: string): Promise<string[]> => {
  const dirents = await readdir(dirName, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent: Dirent) => getFilesFromDirent(dirent, dirName)),
  );

  return Array.prototype.concat(...files);
};

const registerRoutes = async (
  file: string,
  dirName: string,
  router: Router,
): Promise<void> => {
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

  const moduleRaw = await import(file);
  const module = moduleRaw.default || moduleRaw;
  Object.keys(module).forEach(registerRoute);
};
