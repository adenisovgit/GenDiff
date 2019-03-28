import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export const getParser = type => parsers[type];

export const getDiffAst = (oldData, newData) => {
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
  return result;
};
