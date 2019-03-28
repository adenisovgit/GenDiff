import { readFileSync } from 'fs';

import genDiff from '../src';

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
