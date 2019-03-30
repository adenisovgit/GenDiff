import { readFileSync } from 'fs';

import genDiff from '../src';

const fastDebug = false;

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

const testArgsFast = [
  ['tree, json',
    '__tests__/__fixtures__/beforetree.json',
    '__tests__/__fixtures__/aftertree.json',
    '__tests__/__fixtures__/result_difftreejson'],
];

if (!fastDebug) {
  test.each(testArgs)(
    '%s',
    (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
      .toBe(readFileSync(resultFileString, 'utf8')),
  );
} else {
  test.each(testArgsFast)(
    '%s',
    (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
      .toBe(readFileSync(resultFileString, 'utf8')),
  );
}
