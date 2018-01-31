import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const selectParser = [
  {
    '.json': JSON.parse,
  },
  {
    '.yml': yaml.safeLoad,
  },
  {
    '.ini': ini.parse,
  },
];

const getParser = (dataType) => {
  const obj = _.find(selectParser, o => o[dataType]);
  return obj[dataType];
};

const parseData = (data, dataType) => {
  const parse = getParser(dataType);
  return parse(data);
};

const diffSearch = (dataBefore, dataAfter) => {
  const keysDataBefore = Object.keys(dataBefore);
  const keysDataAfter = Object.keys(dataAfter);

  const unionKeys = _.union(keysDataBefore, keysDataAfter);
  const arr = unionKeys.map((key) => {
    if (!(key in dataAfter)) {
      return `- ${key}: ${dataBefore[key]}`;
    }
    if (!(key in dataBefore)) {
      return `+ ${key}: ${dataAfter[key]}`;
    }
    if (dataBefore[key] === dataAfter[key]) {
      return `  ${key}: ${dataAfter[key]}`;
    }
    if (key in dataAfter && key in dataBefore) {
      return [`- ${key}: ${dataBefore[key]}`,
        `+ ${key}: ${dataAfter[key]}`];
    }
    return `+ ${key}: ${dataAfter[key]}`;
  });

  const result = `{\n${_.flatten(arr).join('\n')}\n}\n`;
  return result;
};

const displayOutput = (resultString) => {
  console.log(resultString);
  return resultString;
};

const genDiff = (fileBefore, fileAfter) => {
  const typeFileBefore = path.extname(fileBefore);
  const typeFileAfter = path.extname(fileAfter);

  const dataBefore = fs.readFileSync(fileBefore, 'utf8');
  const dataAfter = fs.readFileSync(fileAfter, 'utf8');

  const parsedDataBefore = parseData(dataBefore, typeFileBefore);
  const parsedDataAfter = parseData(dataAfter, typeFileAfter);

  const diffInArray = diffSearch(parsedDataBefore, parsedDataAfter);
  return displayOutput(diffInArray);
};

export default genDiff;
