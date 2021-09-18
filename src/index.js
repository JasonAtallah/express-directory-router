const { Router } = require('express');
const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

function genPath(dirName, file) {
  // TODO: handled routes prefixed with './'
  return file
    .split(dirName)[1]
    .split(file.includes('index.js') ? 'index.js' : '.js')[0];
}

exports.createDirRouter = async dirName => {
  const router = Router();

  const files = await getFiles(dirName);

  files.forEach(file => {
    const module = require(file);
    Object.keys(module).map(modExport => {
      try {
        const path = genPath(dirName, file);
        const modExportMw = module[modExport];
        const modExportMwArray = Array.isArray(modExportMw)
          ? modExportMw
          : [modExportMw];
        router[modExport](path, ...modExportMwArray);
      } catch (error) {
        console.log(
          `ERROR:express-directory-router\n\t[METHOD] ${modExport}\n\t[FILE] ${file}\n\t[MESSAGE] Failed to create route`,
        );
      }
    });
  });

  return router;
};
