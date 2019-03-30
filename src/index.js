import { readFileSync, existsSync } from 'fs';
import path from 'path';
import getParser from './parsers';
import getDiffAst from './ast';
import getRenderer from './renders';

const checkForWrongFiles = fileNames => fileNames
  .reduce((acc, fileName) => (existsSync(fileName) ? acc : [...acc, fileName]), []);

const genDiff = (fileName1, fileName2, format = 'diff') => {
  const wrongFiles = checkForWrongFiles([fileName1, fileName2]);
  if (wrongFiles.length !== 0) {
    return `Could not find this files:\n ${wrongFiles.join('\n')}`;
  }

  if (!['diff', 'plain'].includes(format)) {
    return 'Wrong format.';
  }

  const parse1 = getParser(path.extname(fileName1).toLowerCase().slice(1));
  const parse2 = getParser(path.extname(fileName2).toLowerCase().slice(1));

  const list1 = parse1(readFileSync(fileName1, 'utf8'));
  const list2 = parse2(readFileSync(fileName2, 'utf8'));
  const diffAst = getDiffAst(list1, list2);
  const renderer = getRenderer(format);
  const result = renderer(diffAst);
  return result;
};

export default genDiff;
