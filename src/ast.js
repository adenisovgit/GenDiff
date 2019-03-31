import _ from 'lodash';

const propertyActions = [
  {
    type: 'group',
    check: (key, oldData, newData) => oldData[key] instanceof Object
      && newData[key] instanceof Object,
    process: (oldData, newData, func) => ({ children: func(oldData, newData) }),
  },
  {
    type: 'same',
    check: (key, oldData, newData) => oldData[key] === newData[key],
    process: (_oldData, newData) => ({ value: newData }),
  },
  {
    type: 'deleted',
    check: (key, _oldData, newData) => (!_.has(newData, key)),
    process: oldData => ({ value: oldData }),
  },
  {
    type: 'added',
    check: (key, oldData) => (!_.has(oldData, key)),
    process: (_oldData, newData) => ({ value: newData }),
  },
  {
    type: 'changed',
    check: () => true,
    process: (oldData, newData) => ({ oldValue: oldData, newValue: newData }),
  },
];

const getPropertyAction = (key, oldData, newData) => propertyActions
  .find(({ check }) => check(key, oldData, newData));

const getDiffAst = (oldData, newData) => {
  const allKeys = _.union(Object.keys(oldData), Object.keys(newData));

  const result = allKeys.map((key) => {
    const { type, process } = getPropertyAction(key, oldData, newData);
    const data = process(oldData[key], newData[key], getDiffAst);
    return { type, key, ...data };
  });

  return result;
};

export default getDiffAst;
