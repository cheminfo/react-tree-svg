import numeral from 'numeral';
import OCL from 'openchemlib/core';

import { SVGBoxesTree } from '../components/SVGBoxesTree';

import { moleculeRenderer } from '../nodeRenderer/moleculeRenderer';

import { reactionTree } from './data/reactionTree';

const masses = [
  97.5624, 105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439,
];
const accuracy = 50;

const props = {
  tree: reactionTree,
  nodeRenderer: moleculeRenderer,
  arrowRendererOptions: {
    getLabel: (node) => {
      return node?.reaction?.label;
    },
    labelPosition: 'center',
  },
  nodeRendererOptions: {
    getTopLabel: (node) => {
      const mz = node?.molecules[0]?.info?.mz;
      if (mz === undefined) return;
      return `${numeral(mz).format('0.0000')} m/z`;
    },
    getBoxStyle: (node) => {
      for (const molecule of node.molecules) {
        if (isInRange(masses, molecule?.info?.mz, accuracy)) {
          return {
            fillOpacity: 0.2,
            fill: 'red',
          };
        }
      }
    },
    getMolecules: (node) => {
      return node.molecules.map((molecule) =>
        OCL.Molecule.fromIDCode(molecule.idCode),
      );
    },
  },
  positionOptions: {
    spacingHorizontal: 150,
  },
};

export default function Fragmentation() {
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

function isInRange(masses: number[], mass: number, accuracy: number): boolean {
  if (!mass || !masses) {
    return false;
  }
  const massAccuracy = (accuracy * mass) / 1e6;

  for (const value of masses) {
    if (Math.abs(value - mass) <= massAccuracy) {
      return true;
    }
  }
  return false;
}
