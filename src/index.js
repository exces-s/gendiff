import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';

const resultToSqreen = (arr) => {
  const result = (`{\n${arr.join('\n')}\n}`);
  return result;
};

const selectParser = [
  {
    type: '.json',
    parser: arg => JSON.parse(fs.readFileSync(arg, 'utf8')),
  },
  {
    type: '.yml',
    parser: arg => yaml.safeLoad(fs.readFileSync(arg, 'utf8')),
  },
];

const getParser = arg => _.find(selectParser, ({ type }) => arg.endsWith(type));

const gendiff = (oldPathToFile, newPathToFile) => {
  const { parser: oldFileParser } = getParser(oldPathToFile);
  const { parser: newFileParser } = getParser(newPathToFile);

  const oldFile = oldFileParser(oldPathToFile);
  const newFile = newFileParser(newPathToFile);

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

export default gendiff;
