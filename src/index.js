import _ from 'lodash';
import { readFileSync, existsSync } from 'fs';

const genDiff = (fileName1, fileName2) => {
  // check if files exist
  const wrongFiles = ([fileName1, fileName2].reduce((acc, fileName) => {
    if (!existsSync(fileName)) {
      return [...acc, fileName];
    }
    return acc;
  }, []));
  if (wrongFiles.length !== 0) {
    return `Could not find this files:\n ${wrongFiles.join('\n')}`;
  }

  const json1 = JSON.parse(readFileSync(fileName1, 'utf8'));
  const json2 = JSON.parse(readFileSync(fileName2, 'utf8'));

  const allKeys = Object.keys({ ...json1, ...json2 });

  const result = allKeys.reduce((acc, key) => {
    if (json1[key] === json2[key]) {
      return [...acc, `   ${key}: ${json1[key]}`];
    }
    if (_.has(json1, key) && _.has(json2, key)) {
      return [...acc, ` - ${key}: ${json1[key]}`, ` + ${key}: ${json2[key]}`];
    }
    if (_.has(json1, key)) {
      return [...acc, ` - ${key}: ${json1[key]}`];
    }

    return [...acc, ` + ${key}: ${json2[key]}`];
  }, ['{']);
  return `${[...result, '}'].join('\n')}`;
};

export default genDiff;
