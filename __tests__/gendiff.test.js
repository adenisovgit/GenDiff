import { readFileSync } from 'fs';

import genDiff from '../src';

const testArgs = [
  ['bad filename',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.jso',
    '__tests__/__fixtures__/result_badFileNamereport'],
  ['json',
    '__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/result_diffplain'],
  /*  ['yml',
    '__tests__/__fixtures__/before.yml',
    '__tests__/__fixtures__/after.yml',
    '__tests__/__fixtures__/result_diffplain'],
  ['ini',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.ini',
    '__tests__/__fixtures__/result_diffplain'],
  ['mixed',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/result_diffplain'], */
  ['tree, json',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.json',
    '__tests__/__fixtures__/result_difftreejson'],
];

test.each(testArgs)(
  '%s',
  (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
    .toBe(readFileSync(resultFileString, 'utf8')),
);
