import numeral from 'numeral';
import OCL from 'openchemlib/core';

import { SVGBoxesTree } from './components/SVGBoxesTree';
//import { getData } from './data/demo/reactionGraph';
import { reactionTree } from './data/demo/reactionTree';
import { reactionTree2 } from './data/demo/reactionTree2';
import { getDataTaxonomy } from './data/demo/taxonomiesWithUrl';
import { getData } from './data/getTreeData';
import { prepareData } from './data/prepareData';
import { moleculeRenderer } from './nodeRenderer/moleculeRenderer';
import { taxonomyRender } from './nodeRenderer/taxonomyRender';

const dataTaxonomy = prepareData(getDataTaxonomy(), {
  nodeRenderer: taxonomyRender,
  rankDepthOptions: {
    maxRankDepth: 8,
  },
  positionOptions: {
    spacingHorizontal: 100,
  },
});
const dataTree = getData(reactionTree, {
  masses: [105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439],
  precision: 50,
});

const masses = [105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439];
const accuracy = 50;

const data = prepareData(reactionTree2, {
  nodeRenderer: moleculeRenderer,
  arrowRendererOptions: {
    getLabel: (node) => {},
  },
  nodeRendererOptions: {
    OCL,
    getTopLabel: (node) => {
      const mz = node?.molecules[0]?.info?.mz;
      if (mz === undefined) return;
      return `${numeral(mz).format('0.0000')} m/z`;
    },
    getBoxStyle: (node) => {
      if (isInRange(masses, node.mz, accuracy)) {
        return {
          fillOpacity: 0.2,
          fill: 'red',
        };
      }
    },
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

function isInRange(masses: number[], mass: number, precision: number): boolean {
  if (!mass || !masses) {
    return false;
  }
  const massAccuracy = (precision * mass) / 1e6;

  for (const value of masses) {
    if (Math.abs(value - mass) <= massAccuracy) {
      return true;
    }
  }
  return false;
}

export default App;
