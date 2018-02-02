#!/usr/bin/env node
import commander from 'commander';
import genDiff from '..';

const program = commander;

program
  .version('0.1.0')
  .arguments('[options] <file1> <file2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((file1, file2, options) => genDiff(file1, file2, options));

program.parse(process.argv);
