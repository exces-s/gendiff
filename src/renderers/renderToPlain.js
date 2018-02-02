const renderToPlain = (ast) => {
  const iter = (data, pathAcc) => {
    const checkComplexValue = arg => (arg instanceof Object ? 'complex value' : arg);
    const diff = (node) => {
      if (node.children.length > 0) {
        const newPathAcc = `${pathAcc}${node.key}.`;
        return iter(node.children, newPathAcc);
      }
      if (node.type === 'added' && node.children.length === 0) {
        return `Property '${pathAcc}${node.key}' was added with value: ${checkComplexValue(node.valueAfter)}`;
      }
      if (node.type === 'removed' && node.children.length === 0) {
        return `Property '${pathAcc}${node.key}' was removed`;
      }
      if (node.type === 'changed' && node.children.length === 0) {
        return `Property '${pathAcc}${node.key}' was updated. From '${node.valueBefore}' to '${node.valueAfter}'`;
      }
      return null;
    };
    const result = data.map(node => diff(node)).filter(v => v);
    return result.join('\n');
  };
  const output = iter(ast, '');
  return `\n${output}\n`;
};

export default renderToPlain;
