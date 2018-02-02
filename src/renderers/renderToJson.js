import _ from 'lodash';

const renderToJson = (ast) => {
  const iter = (data) => {
    const dataAction = [
      {
        pair: node => ({ [`  ${node.key}`]: iter(node.children) }),
        check: node => node.type === 'changed',
      },
      {
        pair: node => ({ [`  ${node.key}`]: node.valueAfter }),
        check: node => node.type === 'unchanged',
      },
      {
        pair: node => ({ [`+ ${node.key}`]: node.valueAfter }),
        check: node => node.type === 'added',
      },
      {
        pair: node => ({ [`- ${node.key}`]: node.valueBefore }),
        check: node => node.type === 'removed',
      },
      {
        pair: node => ({
          [`- ${node.key}`]: node.valueBefore,
          [`+ ${node.key}`]: node.valueAfter,
        }),
        check: node => node.type === 'updated',
      },
    ];

    const getData = (arg) => {
      const { pair } = _.find(dataAction, ({ check }) => check(arg));
      return pair(arg);
    };

    const obj = data.reduce((acc, node) => ({ ...acc, ...getData(node) }), {});
    return obj;
  };
  const output = JSON.stringify(iter(ast));
  return `${output}\n`;
};

export default renderToJson;
