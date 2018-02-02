import renderToPlain from './renderToPlain';
import renderToTree from './renderToTree';
import renderToJson from './renderToJson';

const rendererSelect = {
  plain: renderToPlain,
  undefined: renderToTree,
  json: renderToJson,
};

const getRenderer = outputStyle => rendererSelect[outputStyle];

export default getRenderer;
