/**
 * Will calculate the SVG of all the node
 * @param data
 */

export function prepareTree(data, options) {
  data = structuredClone(data);
  prepareTreeSS(data, options);
  return data;
}

function prepareTreeSS(data, options) {
  const { nodeRenderer, nodeRendererOptions = {}, shouldSkipBranch } = options;
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
      if (shouldSkipBranch) {
        datum.children = datum.children.filter(
          (child) => !shouldSkipBranch(child),
        );
      }
      prepareTreeSS(datum.children, {
        ...options,
        parent: datum,
      });
    }
  }
}
