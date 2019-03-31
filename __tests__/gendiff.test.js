import { readFileSync } from 'fs';

import genDiff from '../src';

const testLogicArgs = [
  ['tree, json, diff',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.json',
    'diff',
    '__tests__/__fixtures__/result_difftreejson'],
  ['tree, yml, plain',
    '__tests__/__fixtures__/beforetree.yml',
    '__tests__/__fixtures__/aftertree.yml',
    'plain',
    '__tests__/__fixtures__/result_plaintree'],
  ['tree, ini, plain',
    '__tests__/__fixtures__/beforetree.ini',
    '__tests__/__fixtures__/aftertree.ini',
    'plain',
    '__tests__/__fixtures__/result_plaintreeini'],
  ['tree, json, json',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.json',
    'diff',
    '__tests__/__fixtures__/result_difftreejson'],
];

test.each(testLogicArgs)(
  '%s',
  (type, fileName1, fileName2, format, resultFileString) => expect(genDiff(fileName1,
    fileName2, format)).toBe(readFileSync(resultFileString, 'utf8')),
);
