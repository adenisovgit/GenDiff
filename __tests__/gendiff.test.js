import genDiff from '../src';

test('проверка на шаге 1', () => {
  const fileName1 = '__tests__/__fixtures__/before.json';
  const fileName2 = '__tests__/__fixtures__/after.json';
  const result = '{\n   host: hexlet.io\n - timeout: 50\n + timeout: 20\n - proxy: 123.234.53.22\n - follow: false\n + verbose: true\n}';

  expect(genDiff(fileName1, fileName2)).toBe(result);
});
