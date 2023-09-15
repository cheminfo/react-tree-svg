/**
 * Will calculate the SVG of the molecule and the rectangle in which to place the molecule and the corresponding label
 * @param data
 */
import { rankDept } from './rankDept';

export function improveData(data, options) {
  data = JSON.parse(JSON.stringify(data));
  improveDataSS(data, options);

  return data;
}

function improveDataSS(data, options) {
  const {
    nodeRenderer,
    nodeRendererOptions = {},
    rankDepthOptions = {},
  } = options;
  if (rankDepthOptions.maxRankDepth) {
    rankDept(data, rankDepthOptions.maxRankDepth);
  }
  for (const datum of data) {
    if (options.level > 0) {
      datum.parent = options.parent;
    }
    const elementAndSize = nodeRenderer(datum, nodeRendererOptions);
    datum.position = {
      x: 0,
      y: 0,
      width: elementAndSize.width,
      height: elementAndSize.height,
    };
    datum.element = elementAndSize.element;
    if (datum.children && datum.children.length === 0) {
      delete datum.children;
    }
    if (datum.children) {
      improveDataSS(datum.children, {
        ...options,
        parent: datum,
      });
    }
  }
}
