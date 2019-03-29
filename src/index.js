import { readFileSync, existsSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers';
import { getDiffAst, renderAst } from './ast';

const checkForWrongFiles = fileNames => fileNames
  .reduce((acc, fileName) => (existsSync(fileName) ? acc : [...acc, fileName]), []);

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
