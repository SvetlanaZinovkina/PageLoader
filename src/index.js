import fsp from 'fs/promises';
import axios from 'axios';
import { cwd } from 'process';
import debug from 'debug';
import { downloadResource, getLinks } from './downloadSrc.js';
import {
  createFileName, getFullLink, isSameDomain, replaceLinks, getHTML,
} from './utilities.js';

const pageLoaderDebug = debug('pageLoader');
const logError = debug('pageLoader:error');

pageLoaderDebug('booting %o', 'Page loader');

export default (url, path = process.cwd()) => {
  pageLoaderDebug('Got url %o', url);
  let sameDomainLinks;
  const assetsPath = `${createFileName(url, '').replace(/\.[^.]+$/, '')}_files`;
  pageLoaderDebug('Downloading assets to folder: %o', assetsPath);
  return getHTML(url)
    .then((response) => {
      const fileName = createFileName(url, '.html');
      const filePath = path.join(path, fileName);
      const links = getLinks(response.data, url);
      sameDomainLinks = links.filter((link) => isSameDomain(link, url));
      const updatedHtml = replaceLinks(sameDomainLinks, response.data, assetsPath, url);
      return fsp
        .writeFile(filePath, updatedHtml)
        .then(() => filePath)
        .catch((e) => logError('Can\'t create file: ', e));
    })
    .then(() => {
      downloadResource(sameDomainLinks, url, path.join(path, assetsPath));
    })
    .catch((e) => logError('Error: ', e));
};
