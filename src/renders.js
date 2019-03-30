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

const normalizeValue = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  if (typeof value === 'string' || value instanceof String) {
    return `'${value}'`;
  }
  return value;
};

const renderActions = [
  {
    type: 'group',
    renderElemDiff: (obj, indent, level, func) => [`${indent}   ${obj.key}: {`, func(obj.children, level + 1), `${indent}   }`],
    renderElemPlain: (obj, parents, func) => func(obj.children, `${parents}${obj.key}.`),
  },
  {
    type: 'same',
    renderElemDiff: (obj, indent) => [`${indent}   ${obj.key}: ${obj.value}`],
    renderElemPlain: () => '',
  },
  {
    type: 'added',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace, subLines] = makePrintValues(obj.value, level + 1);
      return [`${indent} + ${obj.key}: ${valueOrBrace}`, ...subLines];
    },
    renderElemPlain: (obj, parents) => `Property '${parents}${obj.key}' was added with value: ${normalizeValue(obj.value)}`,
  },
  {
    type: 'deleted',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace, subLines] = makePrintValues(obj.value, level + 1);
      return [`${indent} - ${obj.key}: ${valueOrBrace}`, ...subLines];
    },
    renderElemPlain: (obj, parents) => `Property '${parents}${obj.key}' was removed`,
  },
  {
    type: 'changed',
    renderElemDiff: (obj, indent, level) => {
      const [valueOrBrace1, subLines1] = makePrintValues(obj.value.new, level + 1);
      const [valueOrBrace2, subLines2] = makePrintValues(obj.value.old, level + 1);

      return [`${indent} + ${obj.key}: ${valueOrBrace1}`, ...subLines1,
        `${indent} - ${obj.key}: ${valueOrBrace2}`, ...subLines2];
    },
    renderElemPlain: (obj, parents) => `Prorerty '${parents}${obj.key}' was updated. From ${normalizeValue(obj.value.old)} to ${normalizeValue(obj.value.new)}`,
  },
];

const renderDiffTree = (ast, level = 0) => ast.map((obj) => {
  const objRender = renderActions.find(({ type }) => (type === obj.type)).renderElemDiff;
  const indent = indentValue(level);
  return objRender(obj, indent, level, renderDiffTree);
});

const renderDiff = (ast, level = 0) => {
  const result = _.flattenDeep(renderDiffTree(ast, level));
  return ['{', ...result, '}'].join('\n');
};

const renderPlainTree = (ast, parents = '') => ast.map((obj) => {
  const objRender = renderActions.find(({ type }) => (type === obj.type)).renderElemPlain;
  return objRender(obj, parents, renderPlainTree);
});

const renderPlain = ast => _.flattenDeep(renderPlainTree(ast)).filter(value => value !== '').join('\n');


const renderers = {
  diff: renderDiff,
  plain: renderPlain,
};

const getRenderer = type => renderers[type];

export default getRenderer;
