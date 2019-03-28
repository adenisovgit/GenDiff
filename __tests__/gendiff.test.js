import { readFileSync } from 'fs';

import genDiff from '../src';

const testArgs = [
  ['bad filename',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.jso',
    '__tests__/__fixtures__/result_badFileNamereport'],
  ['tree, json',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.json',
    '__tests__/__fixtures__/result_difftreejson'],
  ['tree, yml',
    '__tests__/__fixtures__/beforetree.yml',
    '__tests__/__fixtures__/aftertree.yml',
    '__tests__/__fixtures__/result_difftreejson'],
  ['tree, ini',
    '__tests__/__fixtures__/beforetree.ini',
    '__tests__/__fixtures__/aftertree.ini',
    '__tests__/__fixtures__/result_difftreeini'],

];

test.each(testArgs)(
  '%s',
  (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
    .toBe(readFileSync(resultFileString, 'utf8')),
);
