import { SVGBoxesTree } from '../src/components/SVGBoxesTree.tsx';
import { taxonomyRenderer } from '../src/nodeRenderer/taxonomyRenderer.tsx';

import { getDataTaxonomy } from './data/taxonomiesWithUrl.ts';

const props = {
  tree: getDataTaxonomy(),
  nodeRenderer: taxonomyRenderer,
  arrowRendererOptions: {
    getLabel: () => {},
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
