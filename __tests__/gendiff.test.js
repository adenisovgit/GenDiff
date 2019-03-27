import { readFileSync } from 'fs';

import genDiff from '../src';

test('flat JSON test', () => {
  const fileName1 = '__tests__/__fixtures__/before.json';
  const fileName2 = '__tests__/__fixtures__/after.json';
  const result = readFileSync('__tests__/__fixtures__/testString1', 'utf8');
  expect(genDiff(fileName1, fileName2)).toBe(result);
});
