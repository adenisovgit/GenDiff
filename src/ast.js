import _ from 'lodash';

const propertyActions = [
  {
    name: 'group',
    check: (key, oldData, newData) => oldData[key] instanceof Object
      && newData[key] instanceof Object,
    process: (key, oldData, newData, getDiffAstRecursive) => (
      [{
        type: 'same',
        key,
        value: getDiffAstRecursive(oldData, newData),
      }]),
  },
  {
    name: 'same',
    check: (key, oldData, newData) => oldData[key] === newData[key],
    process: (key, _oldData, newData) => (
      [{
        type: 'same',
        key,
        value: newData,
      }]),
  },
  {
    name: 'deleted',
    check: (key, _oldData, newData) => (!_.has(newData, key)),
    process: (key, oldData) => (
      [{
        type: 'deleted',
        key,
        value: oldData,
      }]),
  },
  {
    name: 'added',
    check: (key, oldData) => (!_.has(oldData, key)),
    process: (key, _oldData, newData) => (
      [{
        type: 'added',
        key,
        value: newData,
      }]),
  },
  {
    name: 'changed',
    check: () => true,
    process: (key, oldData, newData) => (
      [{
        type: 'deleted',
        key,
        value: oldData,
      },
      {
        type: 'added',
        key,
        value: newData,
      }]),
  },
];

const getPropertyAction = (key, oldData, newData) => propertyActions
  .find(({ check }) => check(key, oldData, newData));

const getDiffAst = (oldData, newData) => {
  const allKeys = _.union(Object.keys(oldData), Object.keys(newData));
  const result = allKeys.reduce((acc, key) => {
    const { process } = getPropertyAction(key, oldData, newData);
    return [...acc, ...process(key, oldData[key], newData[key], getDiffAst)];
  }, []);
  return result;
};

export default getDiffAst;
