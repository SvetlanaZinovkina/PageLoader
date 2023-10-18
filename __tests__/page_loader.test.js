import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import nock from 'nock';
import prettier from 'prettier';
import pageloader from '../src/index.js';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';

let tempdir;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

beforeEach(async () => {
  nock.cleanAll();
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('html test', async () => {
  const responseBefore = await fsp.readFile(
    path.join('.', '__fixtures__', 'before-ru-hexlet-io-courses.html'),
    'utf-8',
  );

  const responseAfter = await fsp.readFile(path.join('.', '__fixtures__', 'ru-hexlet-io-courses.html'), 'utf-8');

  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, responseBefore)
    .get('/courses')
    .reply(200, responseBefore)
    .get('/assets/application.css')
    .reply(200, 'application.css')
    .get('/packs/js/runtime.js')
    .reply(200, 'runtime.js')
    .get('/assets/professions/nodejs.png')
    .reply(200, 'nodejs.png');

  await pageloader(url, tempdir);

  const dataBody = await fsp.readFile(
    path.join(tempdir, 'ru-hexlet-io-courses.html'),
    'utf-8',
  );

  const prettifiedResult = await prettier.format(dataBody, { parser: 'html' });
  const prettifiedAfter = await prettier.format(responseAfter, { parser: 'html' });

  expect(prettifiedResult).toEqual(prettifiedAfter);
});

test('network error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(404, await fsp.readFile(getFixturePath('source.html'), 'utf-8'));
  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(404, await fsp.readFile(getFixturePath('nodejs.png')));
  await expect(pageloader('https://ru.hexlet.io/courses', '/usr')).rejects.toThrow(new Error('Request failed with status code 404'));
});

test('parsing error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fsp.readFile(getFixturePath('expected.json'), 'utf-8'));
  await expect(pageloader('https://ru.hexlet.io/courses', tempdir)).not.toBeNull();
});

test('dir read error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, await fsp.readFile(getFixturePath('source.html'), 'utf-8'));
  await expect(pageloader('https://ru.hexlet.io/courses', '/sys')).rejects.toThrow(new Error("ENOENT: no such file or directory, mkdir '/sys/ru-hexlet-io-courses_files'"));
});
