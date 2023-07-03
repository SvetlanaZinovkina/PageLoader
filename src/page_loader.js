import fsp from 'fs/promises';
import axios from 'axios';
import url from 'url';
import { cwd } from 'process';
import nameFile from './renameUrl.js';

const readUrl = (link, path = process.cwd()) => {
  const read = axios
    .get(link)
    .then((html) => fsp.writeFile(path.concat('/', nameFile(link)), html.data));
  return read;
};

export default readUrl;
