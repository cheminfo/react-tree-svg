import { Molecule } from 'openchemlib';

import { SVGBoxesTree } from '../src/components/SVGBoxesTree.tsx';
import { moleculeRenderer } from '../src/nodeRenderer/moleculeRenderer.tsx';

import { reactionTree } from './data/reactionTree.ts';

const masses = [
  97.5624, 105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439,
];
const accuracy = 50;

const props = {
  tree: reactionTree,
  nodeRenderer: moleculeRenderer,
  arrowRendererOptions: {
    getLabel: (node) => {
      return `Hello\n${node?.reaction?.label}\nWorld`;
    },
    verticalPosition: 'top',
    getID: () => {
      return Math.random().toString();
    },
    horizontalPosition: 'left',
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
      return undefined;
    },
    getMoleculeStyle: (molecule, node, index) => {
      if (node.depth) return undefined;
      if (index === 0) {
        return { fill: 'green', fillOpacity: 0.4 };
      }
      if (index === 1) {
        return { fill: 'blue', fillOpacity: 0.4 };
      }
      return undefined;
    },
    getMolecules: (node) => {
      return node.molecules.map((molecule) => {
        if (molecule.idCode) {
          return Molecule.fromIDCode(molecule.idCode);
        }
        if (molecule.smiles) {
          return Molecule.fromSmiles(molecule.smiles);
        }
        return null;
      });
    },
  },
  positionOptions: {
    spacingHorizontal: 150,
  },
  shouldSkipBranch: (node) => {
    return node.skipBranch;
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
