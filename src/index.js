import commander from 'commander';
import fs from 'fs';
import _ from 'lodash';

const resultToSqreen = (arr) => {
  const result = (`{\n${arr.join('\n')}\n}`);
  console.log(result);
  return result;
};

export const compare = (oldPathToFile, newPathToFile) => {
  const oldFile = JSON.parse(fs.readFileSync(oldPathToFile));
  const newFile = JSON.parse(fs.readFileSync(newPathToFile));
  const oldFileKeys = Object.keys(oldFile);
  const newFileKeys = Object.keys(newFile);

  const commonKeys = _.intersection(oldFileKeys, newFileKeys);
  const oldUniqKeys = _.difference(oldFileKeys, commonKeys);
  const newUniqKeys = _.difference(newFileKeys, commonKeys);

  const result = [];
  oldUniqKeys.map(key => result.push(`- ${key}: ${oldFile[key]}`));
  newUniqKeys.map(key => result.push(`+ ${key}: ${newFile[key]}`));
  commonKeys.map((key) => {
    if (oldFile[key] === newFile[key]) {
      return result.push(`  ${key}: ${newFile[key]}`);
    }
    return result.push(`+ ${key}: ${newFile[key]}`, `- ${key}: ${oldFile[key]}`);
  });
  return resultToSqreen(result);
};

const program = commander;

program
  .version('0.1.0')
  .arguments('<file1> <file2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((file1, file2) => compare(file1, file2));

const start = () => program.parse(process.argv);
export default start;
