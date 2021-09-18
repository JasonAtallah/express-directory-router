const { Router } = require('express');
const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

function genPath(dirName, file) {
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
        router[modExport](path, module[modExport]);
      } catch (error) {
        console.log('failed for', file, modExport);
      }
    });
  });

  return router;
};
