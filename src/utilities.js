import path from 'path';
import fs from 'fs/promises';
import * as cheerio from 'cheerio';
import axios from 'axios';

const changeUrl = (url) => url.replace(/\W+/g, '-').replace(/-+$/, '');

export const urlToFilename = (url) => {
  const { pathname, hostname } = url;
  const { ext, dir, name } = path.parse(pathname);
  const filename = changeUrl(`${hostname}/${dir}/${name}`);
  const fileExtension = ext || '.html';

  return `${filename}${fileExtension}`;
};

export const urlToDirname = (url) => {
  const { pathname, hostname } = url;
  const { dir, name } = path.parse(pathname);
  const dirname = changeUrl(`${hostname}/${dir}/${name}`);

  return `${dirname}_files`;
};

export const extractAssets = (data, pageUrl, dirName) => {
  const tagsAttributes = {
    img: 'src',
    link: 'href',
    script: 'src',
  };

  const { origin } = pageUrl;
  const $ = cheerio.load(data);
  const assets = Object.entries(tagsAttributes)
    .flatMap(([tagName, attribute]) => $(`${tagName}[${attribute}]`)
      .toArray() // преобразуем в массив данные из html(cheerio)=>($(`${tagName}[${attribute}]`))
      .map((element) => {
        const $element = $(element);
        const src = $element.attr(attribute);
        const assetUrl = new URL(src, origin);
        const name = urlToFilename(assetUrl);

        return {
          $element,
          assetUrl,
          attribute,
          name,
        };
      }))
    .filter(({ assetUrl }) => assetUrl.origin === origin)
    .map(({
      $element, assetUrl, attribute, name,
    }) => {
      $element.attr(attribute, `${dirName}/${name}`);

      return { assetUrl, name };
    });

  const html = $.root().html();

  return { html, assets };
};

export const writeFile = (filePath, content) => fs.writeFile(filePath, content);

export const downloadAsset = (pageUrl, assetPath) => axios
  .get(pageUrl, { responseType: 'arraybuffer' })
  .then((response) => writeFile(assetPath, response.data));
