import _ from 'lodash';

export const getDiffAst = (oldData, newData) => {
  const allKeys = Object.keys({ ...oldData, ...newData });
  const result = allKeys.reduce((acc, key) => {
    // both keys are Objects
    if ((oldData[key] instanceof Object) && (newData[key] instanceof Object)) {
      const subTree = getDiffAst(oldData[key], newData[key]);
      const record = { type: 'same', key, value: subTree };
      return [...acc, record];
    }

    // key not exist in new list
    if (_.has(oldData, key) && !_.has(newData, key)) {
      const oldRecord = { type: 'old', key, value: oldData[key] };
      return [...acc, oldRecord];
    }

    // key not exist in old list
    if (!_.has(oldData, key) && _.has(newData, key)) {
      const newRecord = { type: 'new', key, value: newData[key] };
      return [...acc, newRecord];
    }

    // both keys are Values or one key is Object other is Value
    if (oldData[key] === newData[key]) {
      const newRecord = { type: 'same', key, value: oldData[key] };
      return [...acc, newRecord];
    }
    const newRecord = { type: 'new', key, value: newData[key] };
    const oldRecord = { type: 'old', key, value: oldData[key] };
    return [...acc, newRecord, oldRecord];
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
