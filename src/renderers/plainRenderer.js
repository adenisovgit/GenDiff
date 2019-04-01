import _ from 'lodash';

const normalizeValue = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  if (typeof value === 'string' || value instanceof String) {
    return `'${value}'`;
  }
  return value;
};

const renderPlainActions = {
  group: (obj, parents, func) => func(obj.children, `${parents}${obj.key}.`),
  same: () => '',
  added: (obj, parents) => `Property '${parents}${obj.key}' was added with value: ${normalizeValue(obj.value)}`,
  deleted: (obj, parents) => `Property '${parents}${obj.key}' was removed`,
  changed: (obj, parents) => `Prorerty '${parents}${obj.key}' was updated. From ${normalizeValue(obj.oldValue)} to ${normalizeValue(obj.newValue)}`,
};

const renderPlainTree = (ast, parents = '') => ast.map(obj => renderPlainActions[obj.type](obj, parents, renderPlainTree));

const renderPlain = ast => _.flattenDeep(renderPlainTree(ast)).filter(value => value !== '').join('\n');

export default renderPlain;
