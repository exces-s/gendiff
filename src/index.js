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

  const sampleNode = {
    key: '',
    valueBefore: '',
    valueAfter: '',
    type: '',
    children: [],
  };

  const nodeProperties = [
    {
      node: key => ({
        type: 'nested',
        children: buildAst(dataBefore[key], dataAfter[key]),
      }),
      check: key =>
        dataAfter[key] instanceof Object && dataBefore[key] instanceof Object,
    },
    {
      node: key => ({
        type: 'unchanged',
        valueBefore: dataBefore[key],
        valueAfter: dataAfter[key],
      }),
      check: key =>
        JSON.stringify(dataBefore[key]) === JSON.stringify(dataAfter[key]),
    },
    {
      node: key => ({
        type: 'updated',
        valueBefore: dataBefore[key],
        valueAfter: dataAfter[key],
      }),
      check: key => key in dataAfter && key in dataBefore,
    },
    {
      node: key => ({
        type: 'removed',
        valueBefore: dataBefore[key],
      }),
      check: key => !(key in dataAfter),
    },
    {
      node: key => ({
        type: 'added',
        valueAfter: dataAfter[key],
      }),
      check: key => !(key in dataBefore),
    },
  ];

  const getNodeProps = (key) => {
    const props = _.find(nodeProperties, ({ check }) => check(key)).node;
    return props(key);
  };

  const ast = unionKeys.map((key) => {
    const nodeProps = getNodeProps(key);

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
