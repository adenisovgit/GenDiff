import _ from 'lodash';

const indentValue = (n = 1) => ` ${'    '.repeat(n)}`;

const stringify = (obj, level) => Object.keys(obj)
  .map((key) => {
    const indent = indentValue(level);
    const value = obj[key];
    if (value instanceof Object) {
      return [`${indent}   ${key}: {`, stringify(value, level + 1), `${indent}   }`];
    }
    return [`${indent}   ${key}: ${value}`];
  });

const prepareObjectValue = (obj, level) => {
  if (obj instanceof Object) {
    return ['{', [...stringify(obj, level), `${indentValue(level - 1)}   }`]];
  }
  return [obj, []];
};

const renderDiffActions = {
  group: (obj, indent, level, func) => [`${indent}   ${obj.key}: {`, func(obj.children, level + 1), `${indent}   }`],
  same: (obj, indent) => [`${indent}   ${obj.key}: ${obj.value}`],
  added: (obj, indent, level) => {
    const [valueOrBrace, subLines] = prepareObjectValue(obj.value, level + 1);
    return [`${indent} + ${obj.key}: ${valueOrBrace}`, ...subLines];
  },
  deleted: (obj, indent, level) => {
    const [valueOrBrace, subLines] = prepareObjectValue(obj.value, level + 1);
    return [`${indent} - ${obj.key}: ${valueOrBrace}`, ...subLines];
  },
  changed: (obj, indent, level) => {
    const [valueOrBrace1, subLines1] = prepareObjectValue(obj.newValue, level + 1);
    const [valueOrBrace2, subLines2] = prepareObjectValue(obj.oldValue, level + 1);

    return [`${indent} + ${obj.key}: ${valueOrBrace1}`, ...subLines1,
      `${indent} - ${obj.key}: ${valueOrBrace2}`, ...subLines2];
  },
};

const renderDiffTree = (ast, level = 0) => ast.map(obj => renderDiffActions[obj
  .type](obj, indentValue(level), level, renderDiffTree));

const renderDiff = (ast, level = 0) => {
  const result = _.flattenDeep(renderDiffTree(ast, level));
  return ['{', ...result, '}'].join('\n');
};

export default renderDiff;
