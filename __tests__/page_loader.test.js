import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { createFileName } from '../src/utilities.js';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';

let tempdir;

beforeEach(async () => {
  nock.cleanAll();
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('html match', async () => {
  const responseBefore = await fsp.readFile(
    path.join('.', '__fixtures__', 'html_before_rename'),
    'utf-8',
  );

  const responseAfter = await fsp.readFile(
    path.join('.', '__fixtures__', 'html_after_rename'),
    'utf-8',
  );

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

  await pageLoader(url, tempdir);

  const dataBody = await fsp.readFile(
    path.join(tempdir, createFileName(url, '.html')),
    'utf-8',
  );

  expect(dataBody).toEqual(responseAfter);
});
