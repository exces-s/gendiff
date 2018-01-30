#!/usr/bin/env node
import commander from 'commander';
import gendiff from '..';

const program = commander;

program
  .version('0.1.0')
  .arguments('<file1> <file2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((file1, file2) => gendiff(file1, file2));

program.parse(process.argv);
