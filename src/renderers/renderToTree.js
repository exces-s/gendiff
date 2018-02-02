const renderToTree = (ast) => {
  const iter = (data, indLvl) => {
    const indent = ' '.repeat(indLvl);
    const indForValue = ' '.repeat(indLvl + 6);
    const indForBrace = ' '.repeat(indLvl + 2);

    const objToString = (arg) => {
      const keys = Object.keys(arg);

      const pair = keys.map(key => (arg[key] instanceof Object ?
        objToString(arg[key]) : `${key}: ${arg[key]}`));

      return pair.join(`\n ${' '.repeat(indLvl + 4)} `);
    };

    const diff = (node) => {
      if (node.type === 'changed' && node.children.length > 0) {
        return `${indent}  ${node.key}: {\n${iter(node.children, indLvl + 4)}\n${indForBrace}}`;
      }
      if (node.type === 'unchanged' && node.valueAfter instanceof Object) {
        return `${indent}  ${node.key}: {\n${indForValue}${objToString(node.valueAfter)}\n${indForBrace}}`;
      }
      if (node.type === 'added' && node.valueAfter instanceof Object) {
        return `${indent}+ ${node.key}: {\n${indForValue}${objToString(node.valueAfter)}\n${indForBrace}}`;
      }
      if (node.type === 'removed' && node.valueBefore instanceof Object) {
        return `${indent}- ${node.key}: {\n${indForValue}${objToString(node.valueBefore)}\n${indForBrace}}`;
      }
      if (node.type === 'unchanged') {
        return `${indent}  ${node.key}: ${node.valueAfter}`;
      }
      if (node.type === 'added' && node.children.length === 0) {
        return `${indent}+ ${node.key}: ${node.valueAfter}`;
      }
      if (node.type === 'removed' && node.children.length === 0) {
        return `${indent}- ${node.key}: ${node.valueBefore}`;
      }
      if (node.type === 'updated' && node.children.length === 0) {
        return [`${indent}- ${node.key}: ${node.valueBefore}\n${indent}+ ${node.key}: ${node.valueAfter}`];
      }
      return null;
    };
    const arr = data.map(node => diff(node));
    return arr.join('\n');
  };
  const output = iter(ast, 2);
  return `{\n${output}\n}\n`;
};

export default renderToTree;
