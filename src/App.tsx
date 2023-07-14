import OCL from 'openchemlib/core';

import { SVGBoxesTree } from './components/SVGBoxesTree';
import { getData } from './data/demo/reactionGraph';
import { getDataTaxonomy } from './data/demo/taxonomiesWithUrl';
import { prepareData } from './data/prepareData';
import { moleculeRenderer } from './nodeRenderer/moleculeRenderer';
import { reactionGraphRender } from './nodeRenderer/reactionGraphRender';
import { taxonomyRender } from './nodeRenderer/taxonomyRender';
/*
const dataTaxonomy = prepareData(getDataTaxonomy(), {
  nodeRenderer: taxonomyRender,
  rankDepthOptions: {
    maxRankDepth: 8,
  },
  positionOptions: {
    spacingHorizontal: 100,
  },
});*/
const data = prepareData(getData(), {
  nodeRenderer: moleculeRenderer,
  nodeRendererOptions: {
    OCL,
    masses: [105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439],
    precision: 50,
  },
  positionOptions: {
    spacingHorizontal: 150,
  },
});
function App() {
  return (
    <div
      style={{
        border: '1px solid red',
        overflow: 'clip',
      }}
    >
      <SVGBoxesTree data={data} />
    </div>
  );
}

export default App;
