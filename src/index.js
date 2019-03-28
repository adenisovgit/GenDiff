import { readFileSync, existsSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import { getParser, getDiffAst } from './parsers';


const checkForWrongFiles = fileNames => fileNames
  .reduce((acc, fileName) => (existsSync(fileName) ? acc : [...acc, fileName]), []);

const indentValue = n => ` ${'    '.repeat(n)}`;
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


const renderAst = (ast, level) => ast.map((obj) => {
  const indent = indentValue(level);
  const diffSign = diffSignSelector[obj.type];
  const keyName = Object.keys(obj)[1];
  const value = obj[keyName];
  if (value instanceof Array) {
    return [`${indent}${diffSign}${keyName}: {`, renderAst(value, level + 1), `${indent}   }`];
  }
  if (value instanceof Object) {
    return [`${indent}${diffSign}${keyName}: {`, stringify(value, level + 1), `${indent}   }`];
  }

  return `${indent}${diffSign}${keyName}: ${value}`;
});

const genDiff = (fileName1, fileName2) => {
  const wrongFiles = checkForWrongFiles([fileName1, fileName2]);
  if (wrongFiles.length !== 0) {
    return `Could not find this files:\n ${wrongFiles.join('\n')}`;
  }

  const parse1 = getParser(path.extname(fileName1).toLowerCase().slice(1));
  const parse2 = getParser(path.extname(fileName2).toLowerCase().slice(1));

  const list1 = parse1(readFileSync(fileName1, 'utf8'));
  const list2 = parse2(readFileSync(fileName2, 'utf8'));
  const diffAst = getDiffAst(list1, list2);

  const result = _.flattenDeep(renderAst(diffAst, 0));
  return ['{', ...result, '}'].join('\n');
};

export default genDiff;
