#!/usr/bin/env node
import { cwd } from "process";
import { program } from "commander/esm.mjs";
import readUrl from "../src/page_loader.js";


program
  .name("page-loader")
  .description("Page loader utility")
  .version("0.1.0")
  .arguments("<url>")
  .option(
    "-o, --output [dir]",
    "output dir (default: \"/home/user/current-dir\")",
    process.cwd()
  )
  .action((url, dir) => console.log(readUrl(url, dir.output)));

program.parse();
