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

const makePrintValues = (obj, level) => {
  if (obj instanceof Object) {
    return ['{', [...stringify(obj, level), `${indentValue(level - 1)}   }`]];
  }
  return [obj, []];
};

const renderActions = [
  {
    type: 'group',
    renderElemDiff: (obj, indent, level, func) => [`${indent}   ${obj.key}: {`, func(obj.children, level + 1), `${indent}   }`],
  },
  {
    type: 'same',
    renderElemDiff: (obj, indent) => [`${indent}   ${obj.key}: ${obj.value}`],
  },
  {
    type: 'added',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace, subLines] = makePrintValues(obj.value, level + 1);
      return [`${indent} + ${obj.key}: ${valueOrBrace}`, ...subLines];
    },
  },
  {
    type: 'deleted',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace, subLines] = makePrintValues(obj.value, level + 1);
      return [`${indent} - ${obj.key}: ${valueOrBrace}`, ...subLines];
    },
  },
  {
    type: 'changed',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace1, subLines1] = makePrintValues(obj.value.new, level + 1);
      const [valueOrBrace2, subLines2] = makePrintValues(obj.value.old, level + 1);

      return [`${indent} + ${obj.key}: ${valueOrBrace1}`, ...subLines1,
        `${indent} - ${obj.key}: ${valueOrBrace2}`, ...subLines2];
    },
  },
];

const renderDiffTree = (ast, level = 0) => ast.map((obj) => {
  const objRender = renderActions.find(({ type }) => (type === obj.type)).renderElemDiff;
  const indent = indentValue(level);
  const result = objRender(obj, indent, level, renderDiffTree);
  return result;
});

export const renderPlain = () => null;

export const renderDiff = (ast, level = 0) => {
  const result = _.flattenDeep(renderDiffTree(ast, level));
  return result;
};
