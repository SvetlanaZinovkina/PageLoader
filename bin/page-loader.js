#!/usr/bin/env node
import { program } from 'commander/esm.mjs';
import pageloader from '../src/index.js';

program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.1.0')
  .arguments('<url>')
  .option(
    '-o, --output [dir]',
    `output dir (default: "${process.cwd()}")`,
    process.cwd(),
  )
  .action((url, dir) => console.log(pageloader(url, dir.output)));

program.parse();
