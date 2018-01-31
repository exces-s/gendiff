import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const selectParser = [
  {
    type: '.json',
    parser: arg => JSON.parse(arg),
  },
  {
    type: '.yml',
    parser: arg => yaml.safeLoad(arg),
  },
];

const getParser = arg => _.find(selectParser, ({ type }) => arg === type);

const parseFile = (readedFile, typeFile) => {
  const { parser: fileParser } = getParser(typeFile);
  return fileParser(readedFile);
};

const diffSearch = (oldFile, newFile) => {
  const oldFileKeys = Object.keys(oldFile);
  const newFileKeys = Object.keys(newFile);

  const unionKeys = _.union(oldFileKeys, newFileKeys);
  const result = unionKeys.map((key) => {
    if (!(key in newFile)) {
      return `- ${key}: ${oldFile[key]}`;
    }
    if (!(key in oldFile)) {
      return `+ ${key}: ${newFile[key]}`;
    }
    if (oldFile[key] === newFile[key]) {
      return `  ${key}: ${newFile[key]}`;
    }
    if (key in newFile && key in oldFile) {
      const arr = [`- ${key}: ${oldFile[key]}`,
        `+ ${key}: ${newFile[key]}`];
      return arr.join('\n');
    }
    return `+ ${key}: ${newFile[key]}`;
  });
  return result;
};

const displayOutput = (arr) => {
  const result = (`{\n${arr.join('\n')}\n}\n`);
  console.log(result);
  return result;
};

const genDiff = (oldFile, newFile) => {
  const oldFileType = path.extname(oldFile);
  const oldFileReaded = fs.readFileSync(oldFile, 'utf8');

  const newFileType = path.extname(newFile);
  const newFileReaded = fs.readFileSync(newFile, 'utf8');

  const oldParsedFile = parseFile(oldFileReaded, oldFileType);
  const newParsedFile = parseFile(newFileReaded, newFileType);

  const diffInArray = diffSearch(oldParsedFile, newParsedFile);
  return displayOutput(diffInArray);
};

export default genDiff;
