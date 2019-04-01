import _ from 'lodash';

const indentValue = (n = 1) => ` ${'    '.repeat(n)}`;

const stringify = (obj, key, state, indent, level) => {
  if (obj instanceof Object) {
    const subLines = Object.keys(obj)
      .map((keyMap) => {
        const indentMap = indentValue(level + 1);
        if (obj[keyMap] instanceof Object) {
          return [`${indentMap}   ${keyMap}: {`, stringify(obj[keyMap], keyMap, '   ', indentMap, level + 1), `${indentMap}   }`];
        }
        return [`${indentMap}   ${keyMap}: ${obj[keyMap]}`];
      });
    return [`${indent}${state}${key}: {`, ...subLines, `${indent}   }`];
  }
  return [`${indent}${state}${key}: ${obj}`];
};

const renderDiffActions = {
  group: (obj, indent, level, func) => [`${indent}   ${obj.key}: {`, func(obj.children, level + 1), `${indent}   }`],
  same: (obj, indent) => [`${indent}   ${obj.key}: ${obj.value}`],
  added: (obj, indent, level) => stringify(obj.value, obj.key, ' + ', indent, level),
  deleted: (obj, indent, level) => stringify(obj.value, obj.key, ' - ', indent, level),
  changed: (obj, indent, level) => [...stringify(obj.newValue, obj.key, ' + ', indent, level), ...stringify(obj.oldValue, obj.key, ' - ', indent, level)],
};

const renderDiffTree = (ast, level = 0) => ast.map(obj => renderDiffActions[obj
  .type](obj, indentValue(level), level, renderDiffTree));

const renderDiff = (ast, level = 0) => {
  const result = _.flattenDeep(renderDiffTree(ast, level));
  return ['{', ...result, '}'].join('\n');
};

export default renderDiff;
