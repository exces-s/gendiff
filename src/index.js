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

const nodeProperties = [
  {
    node: (valueBefore, valueAfter, fn) => ({
      type: 'nested',
      children: fn(valueBefore, valueAfter),
    }),
    check: (key, dataBefore, dataAfter) =>
      dataAfter[key] instanceof Object && dataBefore[key] instanceof Object,
  },
  {
    node: (valueBefore, valueAfter) => ({
      type: 'unchanged',
      valueBefore,
      valueAfter,
    }),
    check: (key, dataBefore, dataAfter) =>
      JSON.stringify(dataBefore[key]) === JSON.stringify(dataAfter[key]),
  },
  {
    node: (valueBefore, valueAfter) => ({
      type: 'updated',
      valueBefore,
      valueAfter,
    }),
    check: (key, dataBefore, dataAfter) =>
      key in dataAfter && key in dataBefore,
  },
  {
    node: valueBefore => ({
      type: 'removed',
      valueBefore,
    }),
    check: (key, dataBefore, dataAfter) =>
      !(key in dataAfter),
  },
  {
    node: (valueBefore, valueAfter) => ({
      type: 'added',
      valueAfter,
    }),
    check: (key, dataBefore) => !(key in dataBefore),
  },
];

const getNodeProps = (key, dataBefore, dataAfter, fn) => {
  const { node } = _.find(nodeProperties, ({ check }) =>
    check(key, dataBefore, dataAfter));

  return node(dataBefore[key], dataAfter[key], fn);
};

const buildAst = (dataBefore, dataAfter) => {
  const keysDataBefore = Object.keys(dataBefore);
  const keysDataAfter = Object.keys(dataAfter);
  const unionKeys = _.union(keysDataBefore, keysDataAfter);

  const sampleNode = {
    key: '',
    valueBefore: '',
    valueAfter: '',
    type: '',
    children: [],
  };

  const ast = unionKeys.map((key) => {
    const nodeProps = getNodeProps(key, dataBefore, dataAfter, buildAst);

    return {
      ...sampleNode,
      ...nodeProps,
      key,
    };
  });
  return ast;
};

const displayOutput = resultString => resultString;

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
