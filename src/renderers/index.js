import renderToPlain from './renderToPlain';
import renderToTree from './renderToTree';

const rendererSelect = {
  plain: renderToPlain,
  undefined: renderToTree,
};

const getRenderer = outputStyle => rendererSelect[outputStyle];

export default getRenderer;
