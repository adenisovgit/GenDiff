import { readFileSync } from 'fs';

import genDiff from '../src';

const testArgs = [
  ['json',
    '__tests__/__fixtures__/before.jSON',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/testString1'],
  ['yml',
    '__tests__/__fixtures__/before.YMl',
    '__tests__/__fixtures__/after.yml',
    '__tests__/__fixtures__/testString1'],
  ['ini',
    '__tests__/__fixtures__/before.iNI',
    '__tests__/__fixtures__/after.ini',
    '__tests__/__fixtures__/testString1'],
  ['mixed',
    '__tests__/__fixtures__/before.iNI',
    '__tests__/__fixtures__/after.jSOn',
    '__tests__/__fixtures__/testString1']];

test.each(testArgs)(
  '%s',
  (type, fileName1, fileName2, resultFileString) => expect(genDiff(fileName1, fileName2))
    .toBe(readFileSync(resultFileString, 'utf8')),
);

/*
test('flat JSON test', () => {
  const fileName1 = '__tests__/__fixtures__/before.jSON';
  const fileName2 = '__tests__/__fixtures__/after.json';
  const result = readFileSync('__tests__/__fixtures__/testString1', 'utf8');
  expect(genDiff(fileName1, fileName2)).toBe(result);
});

test('flat YAML test', () => {
  const fileName1 = '__tests__/__fixtures__/before.YMl';
  const fileName2 = '__tests__/__fixtures__/after.yml';
  const result = readFileSync('__tests__/__fixtures__/testString1', 'utf8');
  expect(genDiff(fileName1, fileName2)).toBe(result);
});

test('flat mixed types test', () => {
  const fileName1 = '__tests__/__fixtures__/before.YMl';
  const fileName2 = '__tests__/__fixtures__/after.json';
  const result = readFileSync('__tests__/__fixtures__/testString1', 'utf8');
  expect(genDiff(fileName1, fileName2)).toBe(result);
});
*/
