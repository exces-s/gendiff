import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getRenderer from './renderers';

const selectParser = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const getParser = dataType => selectParser[dataType];

const parseData = (data, dataType) => {
  const parse = getParser(dataType);
  return parse(data);
};

const buildAst = (dataBefore, dataAfter) => {
  const keysDataBefore = Object.keys(dataBefore);
  const keysDataAfter = Object.keys(dataAfter);
  const unionKeys = _.union(keysDataBefore, keysDataAfter);

  const ast = unionKeys.map((key) => {
    if (JSON.stringify(dataBefore[key]) === JSON.stringify(dataAfter[key])) {
      return {
        key,
        valueBefore: dataBefore[key],
        valueAfter: dataAfter[key],
        type: 'unchanged',
        children: [],
      };
    }
    if (dataAfter[key] instanceof Object && dataBefore[key] instanceof Object) {
      return {
        key,
        valueBefore: '',
        valueAfter: '',
        type: 'changed',
        children: buildAst(dataBefore[key], dataAfter[key]),
      };
    }
    if (key in dataAfter && key in dataBefore) {
      return {
        key,
        valueBefore: dataBefore[key],
        valueAfter: dataAfter[key],
        type: 'changed',
        children: [],
      };
    }
    if (dataBefore[key] === dataAfter[key]) {
      return {
        key,
        valueBefore: dataAfter[key],
        valueAfter: dataAfter[key],
        type: 'unchanged',
        children: [],
      };
    }
    if (!(key in dataAfter)) {
      return {
        key,
        valueBefore: dataBefore[key],
        valueAfter: '',
        type: 'removed',
        children: [],
      };
    }
    if (!(key in dataBefore)) {
      return {
        key,
        valueBefore: '',
        valueAfter: dataAfter[key],
        type: 'added',
        children: [],
      };
    }
    return null;
  });
  return ast;
};

const displayOutput = (resultString) => {
  console.log(resultString);
  return resultString;
};

const genDiff = (fileBefore, fileAfter, outputStyle) => {
  const typeFileBefore = path.extname(fileBefore);
  const typeFileAfter = path.extname(fileAfter);

  const dataBefore = fs.readFileSync(fileBefore, 'utf8');
  const dataAfter = fs.readFileSync(fileAfter, 'utf8');
  const parsedDataBefore = parseData(dataBefore, typeFileBefore);
  const parsedDataAfter = parseData(dataAfter, typeFileAfter);

  const ast = buildAst(parsedDataBefore, parsedDataAfter);
  const render = getRenderer(outputStyle);
  const diff = render(ast);

  return displayOutput(diff);
};

export default genDiff;
