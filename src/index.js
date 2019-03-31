import { readFileSync, existsSync } from 'fs';
import path from 'path';
import getParser from './parsers';
import getDiffAst from './ast';
import getRenderer from './renderers';

const checkForWrongFiles = fileNames => fileNames
  .reduce((acc, fileName) => (existsSync(fileName) ? acc : [...acc, fileName]), []);

const genDiff = (fileName1, fileName2, format = 'diff') => {
  const wrongFiles = checkForWrongFiles([fileName1, fileName2]);
  if (wrongFiles.length !== 0) {
    const errorMessage = `Could not find this files:\n ${wrongFiles.join('\n')}`;
    throw errorMessage;
  }
  if (!['diff', 'plain', 'json'].includes(format.toLowerCase())) {
    const errorMessage = 'Wrong format';
    throw errorMessage;
  }

  const parse1 = getParser(path.extname(fileName1).toLowerCase().slice(1));
  const parse2 = getParser(path.extname(fileName2).toLowerCase().slice(1));

  const data1 = parse1(readFileSync(fileName1, 'utf8'));
  const data2 = parse2(readFileSync(fileName2, 'utf8'));
  const diffAst = getDiffAst(data1, data2);
  const renderer = getRenderer(format.toLowerCase());
  const result = renderer(diffAst);
  return result;
};

export default genDiff;
