import * as cheerio from 'cheerio';
import fsp from 'fs/promises';

const downloadImage = (html) => {
  const readFile = fsp
    .readFile(html, { encoding: 'utf8' })
    // .then((file1) => console.log(file1));
    .then((file) => {
      const $ = cheerio.load(file);
      console.log($);
      return $;
    })
    .then((htmlFile) => console.log(htmlFile('link').text()));

  return readFile;
};
