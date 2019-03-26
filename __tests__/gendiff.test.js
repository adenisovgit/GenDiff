import { readFileSync } from 'fs';

import genDiff from '../src';

test('flat JSON test', () => {
  const fileName1 = '__tests__/__fixtures__/before.json';
  const fileName2 = '__tests__/__fixtures__/after.json';
  const result = String(readFileSync('__tests__/__fixtures__/testString1'));
  expect(genDiff(fileName1, fileName2)).toBe(result);
});
