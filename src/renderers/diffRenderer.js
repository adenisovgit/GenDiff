const indentValue = (n = 1) => ` ${'    '.repeat(n)}`;

const stringify = (obj, key, state, indent, level) => {
  if (!(obj instanceof Object)) {
    return `${indent}${state}${key}: ${obj}\n`;
  }

  const subLines = Object.keys(obj)
    .map((keyMap) => {
      const indentMap = indentValue(level + 1);
      return stringify(obj[keyMap], keyMap, '   ', indentMap, level + 1);
    });
  return `${indent}${state}${key}: {\n${subLines}${indent}   }\n`;
};

const renderDiffActions = {
  group: (obj, indent, level, func) => `${indent}   ${obj.key}: ${func(obj.children, level + 1)}\n`,
  same: (obj, indent) => `${indent}   ${obj.key}: ${obj.value}\n`,
  added: (obj, indent, level) => stringify(obj.value, obj.key, ' + ', indent, level),
  deleted: (obj, indent, level) => stringify(obj.value, obj.key, ' - ', indent, level),
  changed: (obj, indent, level) => `${stringify(obj.newValue, obj.key, ' + ', indent, level)}${stringify(obj.oldValue, obj.key, ' - ', indent, level)}`,
};

const renderDiff = (ast, level = 0) => {
  const result = ast.map(obj => renderDiffActions[obj
    .type](obj, indentValue(level), level, renderDiff));
  return `{\n${result.join('')}${indentValue(level).slice(1)}}`;
};

export default renderDiff;
