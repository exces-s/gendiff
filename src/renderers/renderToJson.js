const renderToJson = (ast) => {
  const iter = (data) => {
    const dataAction = {
      nested: node => ({ [`  ${node.key}`]: iter(node.children) }),
      unchanged: node => ({ [`  ${node.key}`]: node.valueAfter }),
      added: node => ({ [`+ ${node.key}`]: node.valueAfter }),
      removed: node => ({ [`- ${node.key}`]: node.valueBefore }),
      updated: node => ({
        [`- ${node.key}`]: node.valueBefore,
        [`+ ${node.key}`]: node.valueAfter,
      }),
    };

    const getData = arg => dataAction[arg.type](arg);

    const obj = data.reduce((acc, node) => ({ ...acc, ...getData(node) }), {});
    return obj;
  };
  const output = JSON.stringify(iter(ast));
  return `${output}\n`;
};

export default renderToJson;
