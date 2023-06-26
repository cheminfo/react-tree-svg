/**
 * Will calculate the SVG of the molecule and the rectangle in which to place the molecule and the corresponding label
 * @param data
 */
export function improveDataTaxonomies(data, options) {
  data = JSON.parse(JSON.stringify(data));
  improveDataSS(data, options);
  return data;
}

function improveDataSS(data, options) {
  const { nodeRenderer } = options;

  for (const datum of data) {
    const componentAndSize = nodeRenderer(datum);
    datum.position = {
      x: 0,
      y: 0,
      width: componentAndSize.width,
      height: componentAndSize.height,
    };
    datum.content = componentAndSize.component;
    if (datum.children && datum.children?.length === 0) {
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
