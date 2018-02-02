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

  const ast = unionKeys.map((key) => {
    const defineType = [
      {
        node: {
          type: 'changed',
        },
        check: arg =>
          dataAfter[arg] instanceof Object && dataBefore[arg] instanceof Object,
      },
      {
        node: {
          type: 'unchanged',
          valueBefore: dataBefore[key],
          valueAfter: dataAfter[key],
        },
        check: arg =>
          JSON.stringify(dataBefore[arg]) === JSON.stringify(dataAfter[arg]),
      },
      {
        node: {
          type: 'unchanged',
          valueBefore: dataBefore[key],
          valueAfter: dataAfter[key],
        },
        check: arg => dataBefore[arg] === dataAfter[arg],
      },
      {
        node: {
          type: 'updated',
          valueBefore: dataBefore[key],
          valueAfter: dataAfter[key],
        },
        check: arg => arg in dataAfter && arg in dataBefore,
      },
      {
        node: {
          type: 'removed',
          valueBefore: dataBefore[key],
        },
        check: arg => !(arg in dataAfter),
      },
      {
        node: {
          type: 'added',
          valueAfter: dataAfter[key],
        },
        check: arg => !(arg in dataBefore),
      },
    ];

    const getNodeProps = arg => _.find(defineType, ({ check }) => check(arg)).node;

    const nodeProps = getNodeProps(key);

    const getChildrenValue = () => (nodeProps.type === 'changed' ?
      buildAst(dataBefore[key], dataAfter[key]) : []);
    return {
      ...sampleNode,
      ...nodeProps,
      key,
      children: getChildrenValue(),
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
