import path from 'path';
import fs from 'fs/promises';
import debug from 'debug';
import axios from 'axios';
import 'axios-debug-log';
import Listr from 'listr';
import {
  getDirname,
  getFilename,
  extractAssets,
  writeFile,
  downloadAsset,
  hasDir,
} from './utilities.js';

const log = debug('page-loader');

const writeAssets = (html, assets) => fs.writeFile(htmlPagePath, html)
  .then(() => assets);

const pageloader = (url, outputassetsDirPath = '') => {
  log(`Page loader has started with url: ${url}, outputassetsDirPath: ${outputassetsDirPath}`);
  const pageUrl = new URL(url);
  const htmlPageFileName = getFilename(pageUrl);
  const htmlPagePath = path.join(outputassetsDirPath, htmlPageFileName);
  const assetsDirName = getDirname(pageUrl);
  const assetsDirPath = path.join(outputassetsDirPath, assetsDirName);

  return axios.get(url)
    .then(({ data: html }) => {
      log(`Assets directory path: '${assetsDirPath}'`);

      return hasDir(html, assetsDirPath);
    })
    .then((html) => {
      log('Extracting assets...');

      return extractAssets(html, pageUrl, assetsDirName);
    })
    .then(({ html, assets }) => {
      log(`HTML page path: '${htmlPagePath}'`);

      return writeFile(htmlPagePath, html)
        .then(() => assets);
    })
    .then((assets) => {
      const tasks = assets.map(({ assetUrl, name }) => {
        const assetPath = path.resolve(assetsDirPath, name);

        return {
          title: `Downloading asset: ${assetUrl.toString()}`,
          task: () => downloadAsset(assetUrl.toString(), assetPath)
            .catch(() => {}),
        };
      });

      const listr = new Listr(tasks, { concurrent: true });

      return listr.run();
    })
    .then(() => htmlPagePath);
};

export default pageloader;
