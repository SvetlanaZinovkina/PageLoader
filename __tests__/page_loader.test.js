import { fileURLToPath } from 'url';
import path from 'path';
import fsp from 'fs/promises';
import os from 'os';
import page_loader from '../src/page_loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const url = 'https://ru.hexlet.io/courses';
const namefile = 'ru-hexlet-io-courses.html';

beforeEach(async () => await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-')));

test('rename file', async () => {
  // expect(page_loader(url))
});
