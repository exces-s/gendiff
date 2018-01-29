#!/usr/bin/env node
import { actions } from 'commander'; //eslint-disable-line

console.log(process.argv);

const program = require('commander');

program
  .version('0.1.0')
  .option('-h, --help', 'output usage information')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);

console.log('');
if (program.help) console.log('  - help');
if (program.version) console.log('  - version');
console.log('  - %s format', program.format);
