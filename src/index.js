import _ from 'lodash';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import getParser from './parsers';

const checkForWrongFiles = fileNames => fileNames
  .reduce((acc, fileName) => (existsSync(fileName) ? acc : [...acc, fileName]), []);

const getDiffAst = (oldData, newData) => {
  const allKeys = Object.keys({ ...oldData, ...newData });
  const result = allKeys.reduce((acc, key) => {
    // both keys are Objects
    if ((oldData[key] instanceof Object) && (newData[key] instanceof Object)) {
      const treePart = getDiffAst(oldData[key], newData[key]);
      const record = { type: 'same', [key]: treePart };
      return [...acc, record];
      // !!!!!!! Add 'SAME' item for object!!!
    }

    // key not exist in new list
    if (_.has(oldData, key) && !_.has(newData, key)) {
      const oldRecord = { type: 'old', [key]: oldData[key] };
      return [...acc, oldRecord];
    }

    // key not exist in old list
    if (!_.has(oldData, key) && _.has(newData, key)) {
      const newRecord = { type: 'new', [key]: newData[key] };
      return [...acc, newRecord];
    }

    // both keys are Values or one key is Object other is Value
    if (oldData[key] === newData[key]) {
      const newRecord = { type: 'same', [key]: oldData[key] };
      return [...acc, newRecord];
    }
    const newRecord = { type: 'new', [key]: newData[key] };
    const oldRecord = { type: 'old', [key]: oldData[key] };
    return [...acc, newRecord, oldRecord];
  }, []);
  console.log(result);
  return result;
};

const genDiff = (fileName1, fileName2) => {
  const wrongFiles = checkForWrongFiles([fileName1, fileName2]);
  if (wrongFiles.length !== 0) {
    return `Could not find this files:\n ${wrongFiles.join('\n')}`;
  }

  const parse1 = getParser(path.extname(fileName1).toLowerCase().slice(1));
  const parse2 = getParser(path.extname(fileName2).toLowerCase().slice(1));

  const list1 = parse1(readFileSync(fileName1, 'utf8'));
  const list2 = parse2(readFileSync(fileName2, 'utf8'));
  const diffAst = getDiffAst(list1, list2);

  return `${diffAst}`;
};

export default genDiff;
