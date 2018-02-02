import _ from 'lodash';

const renderToPlain = (ast) => {
  const iter = (data, pathAcc) => {
    const checkComplexValue = arg => (arg instanceof Object ? 'complex value' : arg);

    const stringAction = [
      {
        string: (node) => {
          const newPathAcc = `${pathAcc}${node.key}.`;
          return iter(node.children, newPathAcc);
        },
        check: node => node.children.length > 0,
      },
      {
        string: node => `Property '${pathAcc}${node.key}' was added with value: ${checkComplexValue(node.valueAfter)}`,
        check: node => node.type === 'added',
      },
      {
        string: node => `Property '${pathAcc}${node.key}' was removed`,
        check: node => node.type === 'removed',
      },
      {
        string: node => `Property '${pathAcc}${node.key}' was updated. From '${node.valueBefore}' to '${node.valueAfter}'`,
        check: node => node.type === 'updated',
      },
      {
        string: () => '',
        check: node => node.type === 'unchanged',
      },
    ];

    const getString = (arg) => {
      const { string } = _.find(stringAction, ({ check }) => check(arg));
      return string(arg);
    };

    const result = data.map(node => getString(node)).filter(v => v);
    return result.join('\n');
  };
  const output = iter(ast, '');
  return `\n${output}\n`;
};

export default renderToPlain;
