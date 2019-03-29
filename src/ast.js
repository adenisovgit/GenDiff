import _ from 'lodash';

const propertyActions = [
  {
    name: 'group',
    check: (oldData, newData) => (oldData instanceof Object && newData instanceof Object),
    process: (key, oldData, newData, getDiffAstRecursive) => (
      [{
        type: 'same',
        key,
        value: getDiffAstRecursive(oldData, newData),
      }]),
  },
  {
    name: 'same',
    check: (oldData, newData) => (oldData === newData),
    process: (key, oldData, newData) => (
      [{
        type: 'same',
        key,
        value: newData,
      }]),
  },
  {
    name: 'old',
    check: (oldData, newData) => (newData === undefined),
    process: (key, oldData) => (
      [{
        type: 'old',
        key,
        value: oldData,
      }]),
  },
  {
    name: 'new',
    check: oldData => (oldData === undefined),
    process: (key, oldData, newData) => (
      [{
        type: 'new',
        key,
        value: newData,
      }]),
  },
  {
    name: 'differs',
    check: () => true,
    process: (key, oldData, newData) => (
      [{
        type: 'old',
        key,
        value: oldData,
      },
      {
        type: 'new',
        key,
        value: newData,
      }]),
  },
];

const getPropertyAction = (oldData, newData) => propertyActions
  .find(({ check }) => check(oldData, newData));

export const getDiffAst = (oldData, newData) => {
  const allKeys = _.union([...Object.keys(oldData), ...Object.keys(newData)]);
  const result = allKeys.reduce((acc, key) => {
    const { process } = getPropertyAction(oldData[key], newData[key]);
    return [...acc, ...process(key, oldData[key], newData[key], getDiffAst)];
  }, []);
  return result;
};

const indentValue = (n = 1) => ` ${'    '.repeat(n)}`;
const diffSignSelector = {
  same: '   ',
  old: ' - ',
  new: ' + ',
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

export const renderAst = (ast, level = 0) => ast.map((obj) => {
  const indent = indentValue(level);
  const diffSign = diffSignSelector[obj.type];
  const { key, value } = obj;
  if (value instanceof Array) {
    return [`${indent}${diffSign}${key}: {`, renderAst(value, level + 1), `${indent}   }`];
  }
  if (value instanceof Object) {
    return [`${indent}${diffSign}${key}: {`, stringify(value, level + 1), `${indent}   }`];
  }

  return `${indent}${diffSign}${key}: ${value}`;
});
