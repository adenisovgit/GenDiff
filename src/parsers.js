import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
};

const getParser = type => parsers[type];

export default getParser;
