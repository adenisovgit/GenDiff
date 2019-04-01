import renderPlain from './plainRenderer';
import renderDiff from './diffRenderer';

const renderers = {
  diff: renderDiff,
  plain: renderPlain,
  json: JSON.stringify,
};

const getRenderer = type => renderers[type];

export default getRenderer;
