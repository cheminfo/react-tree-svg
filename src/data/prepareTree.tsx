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
    if (options.parent) {
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
        const parents = [datum];
        let parent = datum.parent;
        while (parent) {
          parents.push(parent);
          parent = parent.parent;
        }
        datum.children = datum.children.filter(
          (child) => !shouldSkipBranch(child, parents),
        );
      }
      prepareTreeSS(datum.children, {
        ...options,
        parent: datum,
      });
    }
  }
}
