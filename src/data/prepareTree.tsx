/**
 * Will calculate the SVG of the molecule and the rectangle in which to place the molecule and the corresponding label
 * @param data
 */

export function prepareTree(data, options) {
  data = JSON.parse(JSON.stringify(data));
  prepareTreeSS(data, options);
  return data;
}

function prepareTreeSS(data, options) {
  const { nodeRenderer, nodeRendererOptions = {} } = options;
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
      prepareTreeSS(datum.children, {
        ...options,
        parent: datum,
      });
    }
  }
}
