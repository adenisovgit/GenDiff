import _ from 'lodash';

const indentValue = (n = 1) => ` ${'    '.repeat(n)}`;
const diffSignSelector = {
  same: '   ',
  deleted: ' - ',
  added: ' + ',
};

const stringify = (obj, level) => Object.keys(obj)
  .map((key) => {
    const indent = indentValue(level);
    const value = obj[key];
    if (value instanceof Object) {
      return [`${indent}   ${key}: {`, stringify(value, level + 1), `${indent}   }`];
    }
    return [`${indent}   ${key}: ${value}`];
  });

const renderDiffActions = [
  {
    type: 'array',
    check: value => value instanceof Array,
    process: (key, value, indent, diffSign, level, renderDiffTreeRecursive) => [`${indent}${diffSign}${key}: {`, renderDiffTreeRecursive(value, level + 1), `${indent}   }`],
  },
  {
    type: 'object',
    check: value => value instanceof Object,
    process: (key, value, indent, diffSign, level) => [`${indent}${diffSign}${key}: {`, stringify(value, level + 1), `${indent}   }`],
  },
  {
    type: 'value',
    check: () => true,
    process: (key, value, indent, diffSign) => [`${indent}${diffSign}${key}: ${value}`],
  },
];

const renderDiffTree = (ast, level = 0) => ast.map((obj) => {
  const indent = indentValue(level);
  const diffSign = diffSignSelector[obj.type];
  const { key, value } = obj;
  const objProcess = renderDiffActions.find(({ check }) => check(value)).process;
  return objProcess(key, value, indent, diffSign, level, renderDiffTree);
});

export const renderPlain = () => null;

export const renderDiff = (ast, level = 0) => {
  const result = _.flattenDeep(renderDiffTree(ast, level));
  return result;
};
