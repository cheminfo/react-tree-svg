/**
 * Deep-clone the tree and attach, to every node, the rendered SVG `element` and
 * its intrinsic `position` size produced by the node renderer.
 * @param data - Root nodes of the tree to render.
 * @param options - Node renderer, its options and the optional branch-skipping callback.
 * @returns The annotated clone, ready to be laid out and drawn.
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
    if (datum.children?.length === 0) {
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
