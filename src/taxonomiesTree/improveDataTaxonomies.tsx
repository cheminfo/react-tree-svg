/**
 * Will calculate the SVG of the molecule and the rectangle in which to place the molecule and the corresponding label
 * @param data
 */
const taxonomiesRanks = {
  superkingdom: 1,
  kingdom: 2,
  phylum: 3,
  class: 4,
  order: 5,
  family: 6,
  genus: 7,
  species: 8,
};
export function improveDataTaxonomies(data, options) {
  data = JSON.parse(JSON.stringify(data));
  improveDataSS(data, options);
  return data;
}

function improveDataSS(data, options) {
  const { nodeRenderer, maxRankDepth = 7 } = options;
  rankDept(data, maxRankDepth);
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
function rankDept(data, maxRankDepth) {
  for (let datum of data) {
    if (taxonomiesRanks[datum.rank] >= maxRankDepth) {
      delete datum.children;
    }
    if (datum.children) {
      rankDept(datum.children, maxRankDepth);
    }
  }
}
