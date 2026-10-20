import { TreeSvg } from '../src/components/TreeSvg.tsx';
import { taxonomyRenderer } from '../src/nodeRenderer/taxonomyRenderer.tsx';

import { getDataTaxonomy } from './data/taxonomiesWithUrl.ts';

const tree = getDataTaxonomy();
const positionOptions = { spacingHorizontal: 100 };

/**
 * Demo page rendering a species taxonomy tree.
 * @returns The demo view.
 */
export default function Taxonomy() {
  return (
    <div
      style={{
        border: '1px solid red',
        overflow: 'clip',
      }}
    >
      <TreeSvg
        tree={tree}
        nodeRenderer={taxonomyRenderer}
        positionOptions={positionOptions}
      />
    </div>
  );
}
