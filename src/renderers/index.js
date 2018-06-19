import renderToPlain from './renderToPlain';
import renderToTree from './renderToTree';
import renderToJson from './renderToJson';

const rendererSelect = {
  plain: renderToPlain,
  json: renderToJson,
};

const getRenderer = outputStyle => (outputStyle === undefined ?
  renderToTree : rendererSelect[outputStyle]);

export default getRenderer;
