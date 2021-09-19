import { Router } from 'express';
import { resolve } from 'path';
import { readdir } from 'fs/promises';
import { Dirent } from 'fs';

export const createDirRouter = async (
  routesDirectory: string,
): Promise<Router> => {
  const router = Router();

  const routesDir = routesDirectory.replace('./', '');
  const routesDirFiles = await getFiles(routesDir);
  await Promise.all(
    routesDirFiles.map(routeFile =>
      registerRoutes(routeFile, routesDir, router),
    ),
  );

  return router;
};

const genRoutePath = (routesDir: string, file: string): string =>
  file
    .split(routesDir)[1]
    // removes extension (.ts or .js)
    .slice(0, -3)
    .replace('/index', '');

const getFiles = async (routesDir: string): Promise<string[]> => {
  const dirents = await readdir(routesDir, { withFileTypes: true });
  const getFilesPromises = dirents.map(async (dirent: Dirent) => {
    const subRoute = resolve(routesDir, dirent.name);

    if (dirent.isDirectory()) {
      return await getFiles(subRoute);
    }

    return subRoute;
  });

  const files = await Promise.all(getFilesPromises);
  return files.flat();
};

const registerRoutes = async (
  file: string,
  routesDir: string,
  router: Router,
): Promise<void> => {
  function registerRoute(modExport: string): void {
    try {
      // Put in array and flatten so either a single mw or an array of mw can be passed in
      const modExportMwArray = [module[modExport]].flat();
      // @ts-expect-error: TODO, find type from express
      router[modExport](path, ...modExportMwArray);
    } catch (error) {
      console.log(
        `[express-directory-router] Failed to create route for ${modExport} in ${file}`,
      );
    }
  }

  const path = genRoutePath(routesDir, file);
  const moduleRaw = await import(file);
  const module = moduleRaw.default || moduleRaw;
  Object.keys(module).forEach(registerRoute);
};
