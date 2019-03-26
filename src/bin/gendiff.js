#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';


import { version } from '../../package.json';

let firstFileName;
let secondFileName;

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    firstFileName = firstConfig;
    secondFileName = secondConfig;
  });

program.parse(process.argv);
console.log(genDiff(firstFileName, secondFileName));
