import _ from 'lodash';

const renderToTree = (ast) => {
  const iter = (data, indentLvl) => {
    const indent = ' '.repeat(indentLvl);
    const indForValue = ' '.repeat(indentLvl + 6);
    const indForBrace = ' '.repeat(indentLvl + 2);

    const objToString = (arg) => {
      const keys = Object.keys(arg);
      const arr = keys.map(key => (arg[key] instanceof Object ? objToString(arg[key]) :
        `${key}: ${arg[key]}`));

      return arr.join(`\n ${' '.repeat(indentLvl + 4)} `);
    };

    const valueString = (value) => {
      const stringForComplex = ` {\n${indForValue}${objToString(value)}\n${indForBrace}}`;
      const stringForSimple = ` ${value}`;
      return value instanceof Object ? stringForComplex : stringForSimple;
    };

    const stringAction = [
      {
        string: node => `${indent}  ${node.key}: {\n${iter(node.children, indentLvl + 4)}\n${indForBrace}}`,
        check: node => node.type === 'changed',
      },
      {
        string: node => `${indent}  ${node.key}:${valueString(node.valueAfter)}`,
        check: node => node.type === 'unchanged',
      },
      {
        string: node => `${indent}+ ${node.key}:${valueString(node.valueAfter)}`,
        check: node => node.type === 'added',
      },
      {
        string: node => `${indent}- ${node.key}:${valueString(node.valueBefore)}`,
        check: node => node.type === 'removed',
      },
      {
        string: node => [`${indent}- ${node.key}: ${node.valueBefore}\n${indent}+ ${node.key}: ${node.valueAfter}`],
        check: node => node.type === 'updated',
      },
    ];

    const getString = (arg) => {
      const { string } = _.find(stringAction, ({ check }) => check(arg));
      return string(arg);
    };

    const arr = data.map(node => getString(node));
    return arr.join('\n');
  };
  const output = iter(ast, 2);
  return `{\n${output}\n}\n`;
};

export default renderToTree;
