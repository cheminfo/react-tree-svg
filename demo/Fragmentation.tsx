import OCL from 'openchemlib/core';

import { SVGBoxesTree } from '../src/components/SVGBoxesTree';
import { moleculeRenderer } from '../src/nodeRenderer/moleculeRenderer';

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
    getID: () => {
      return Math.random().toString();
    },
    labelPosition: 'center',
  },
  nodeRendererOptions: {
    getID: () => {
      return Math.random().toString();
    },
    getTopLabel: (node) => {
      const mz = node?.molecules[0]?.info?.mz;
      if (mz === undefined) return;
      return `${mz.toFixed(4)} m/z`;
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
      return node.molecules.map((molecule) => {
        if (molecule.idCode) {
          return OCL.Molecule.fromIDCode(molecule.idCode);
        }
        if (molecule.smiles) {
          return OCL.Molecule.fromSmiles(molecule.smiles);
        }
        return null;
      });
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
