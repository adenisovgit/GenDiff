import _ from 'lodash';

const propertyActions = [
  {
    name: 'group',
    check: (oldData, newData) => (oldData instanceof Object && newData instanceof Object),
    process: (key, oldData, newData, getDiffAstRecursive) => (
      [{
        type: 'same',
        key,
        value: getDiffAstRecursive(oldData, newData),
      }]),
  },
  {
    name: 'same',
    check: (oldData, newData) => (oldData === newData),
    process: (key, oldData, newData) => (
      [{
        type: 'same',
        key,
        value: newData,
      }]),
  },
  {
    name: 'old',
    check: (_oldData, newData) => (newData === undefined),
    process: (key, oldData) => (
      [{
        type: 'old',
        key,
        value: oldData,
      }]),
  },
  {
    name: 'new',
    check: oldData => (oldData === undefined),
    process: (key, _oldData, newData) => (
      [{
        type: 'new',
        key,
        value: newData,
      }]),
  },
  {
    name: 'differs',
    check: () => true,
    process: (key, oldData, newData) => (
      [{
        type: 'old',
        key,
        value: oldData,
      },
      {
        type: 'new',
        key,
        value: newData,
      }]),
  },
];

const getPropertyAction = (oldData, newData) => propertyActions
  .find(({ check }) => check(oldData, newData));

const getDiffAst = (oldData, newData) => {
  const allKeys = _.union([...Object.keys(oldData), ...Object.keys(newData)]);
  const result = allKeys.reduce((acc, key) => {
    const { process } = getPropertyAction(oldData[key], newData[key]);
    return [...acc, ...process(key, oldData[key], newData[key], getDiffAst)];
  }, []);
  return result;
};

export default getDiffAst;
