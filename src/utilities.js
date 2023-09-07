import axios from 'axios';
import debug from 'debug';

export const createFileName = (url, fileType) => {
  const name = new URL(url);
  const fileName = name
    .toString()
    .replace(`${name.protocol}//`, '')
    .replace(fileType, '')
    .replace(/[^a-zA-Z0-9]/g, '-');
  return `${fileName}${fileType}`;
};

export const getFullLink = (relativeUrl, baseUrl) => {
  const url = new URL(relativeUrl, baseUrl);
  return url.toString();
};

export const replaceLinks = (links, html, assetsPath, baseUrl) => {
  let result = html;

  links.forEach((link) => {
    const fileType = link.includes('.') ? `.${link.split('.').pop()}` : '.html';
    const fullLink = getFullLink(link, baseUrl);
    const fileName = createFileName(fullLink, fileType);

    result = result.replace(link, `${assetsPath}/${fileName}`).replace(' />', '>');
  });

  return result;
};

export const isSameDomain = (url, baseUrl) => {
  const link = new URL(url, baseUrl);
  return link.hostname === new URL(baseUrl).hostname || url.startsWith('/');
};

const logAxios = debug('axios');

export const getHTML = (url) => axios.get(url).catch((e) => logAxios(e));
