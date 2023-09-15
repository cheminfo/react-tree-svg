import { SVGBoxesTree } from './components/SVGBoxesTree';
import { getDataTaxonomy } from './data/demo/taxonomiesWithUrl';
import { taxonomyRenderer } from './nodeRenderer/taxonomyRenderer';

const props = {
  tree: getDataTaxonomy(),
  nodeRenderer: taxonomyRenderer,
  arrowRendererOptions: {
    getLabel: (node) => {},
  },
  nodeRendererOptions: {
    maxRankDepth: 8,
  },
  positionOptions: {
    spacingHorizontal: 100,
  },
};

export default function Taxonomy() {
  return (
    <div
      style={{
        border: '1px solid red',
        overflow: 'clip',
      }}
    >
      <SVGBoxesTree {...props} />
    </div>
  );
}
