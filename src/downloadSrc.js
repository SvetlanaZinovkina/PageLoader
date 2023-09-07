import * as cheerio from 'cheerio';
import fs from 'fs';
import fsp from 'fs/promises';
import axios from 'axios';
import path from 'path';
import debug from 'debug';
import { createFileName, getFullLink } from './utilities.js';

const logAxios = debug('axios');

export const getLinks = (html, url) => {
  const $ = cheerio.load(html);
  const tags = $('link[href], img[src], script');
  const links = [];
  tags.each((_, tag) => {
    const src = $(tag).attr('src') || $(tag).attr('href');
    if (src !== undefined && src !== url) {
      links.push(src);
    }
  });
  return links;
};

const downloadSrc = (links, url, filepath = process.cwd()) => {
  Promise.all(
    links.map((link) => {
      const fullLink = getFullLink(link, url);
      const fileType = link.includes('.') ? `.${link.split('.').pop()}` : '.html';
      const fileName = createFileName(fullLink, fileType);
      // console.log(fileName);
      // console.log(fullLink);
      // console.log(fileType);
      axios.get(fullLink, { responseType: 'stream' })
        .then((response) => {
          response.data.pipe(fs.createWriteStream(path.join(filepath, fileName)));
        });
    }),
  )
    .catch((e) => logAxios('Axios error: ', e));
};

export const downloadResource = (links, url, filepath) => {
  fsp
    .mkdir(filepath)
    .then(() => {
      downloadSrc(links, url, filepath);
    })
    .catch((error) => {
      console.error(`Error creating directory: ${error}`);
    });
};
