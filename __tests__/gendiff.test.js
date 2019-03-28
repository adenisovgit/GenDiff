import { readFileSync } from 'fs';

import genDiff from '../src';

const testArgs = [
  ['json',
    '__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/testString1'],
  ['yml',
    '__tests__/__fixtures__/before.yml',
    '__tests__/__fixtures__/after.yml',
    '__tests__/__fixtures__/testString1'],
  ['ini',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.ini',
    '__tests__/__fixtures__/testString1'],
  ['mixed',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/testString1'],
  ['bad filename',
    '__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.jso',
    '__tests__/__fixtures__/badFileNamereport']];

test.each(testArgs)(
  '%s',
  (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
    .toBe(readFileSync(resultFileString, 'utf8')),
);
