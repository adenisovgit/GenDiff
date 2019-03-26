import { has } from 'lodash';
import { readFileSync, existsSync } from 'fs';

const genDiff = (fileName1, fileName2) => {
  // check if files exist
  if (!existsSync(fileName1)) {
    return `${fileName1} отсутствует`;
  }
  if (!existsSync(fileName2)) {
    return `${fileName2} отсутствует`;
  }

  const json1 = JSON.parse(readFileSync(fileName1));
  const json2 = JSON.parse(readFileSync(fileName2));

  const allKeys = Object.keys({ ...json1, ...json2 });

  const result = allKeys.reduce((acc, key) => {
    if (json1[key] === json2[key]) {
      return [...acc, `   ${key}: ${json1[key]}`];
    }
    if (has(json1, key) && has(json2, key)) {
      return [...acc, ` - ${key}: ${json1[key]}`, ` + ${key}: ${json2[key]}`];
    }
    if (has(json1, key)) {
      return [...acc, ` - ${key}: ${json1[key]}`];
    }

    return [...acc, ` + ${key}: ${json2[key]}`];
  }, ['{']);
  return `${[...result, '}'].join('\n')}`;
};

export default genDiff;
