import { Molecule } from 'openchemlib';

import { TreeSvg } from '../src/components/TreeSvg.tsx';
import { moleculeRenderer } from '../src/nodeRenderer/moleculeRenderer.tsx';

import { reactionTree } from './data/reactionTree.ts';

interface ReactionNode {
  molecules: Array<{
    idCode?: string;
    smiles?: string;
    info?: { mf?: string; mz?: number };
  }>;
  reaction?: { label?: string };
  depth?: number;
  skipBranch?: boolean;
  children?: ReactionNode[];
}

const tree: ReactionNode[] = reactionTree;
const masses = [
  97.5624, 105.0697, 58.065, 194.1173, 163.0752, 133.0647, 135.0439,
];
const accuracy = 50;

/**
 * Demo page rendering a mass-spectrometry fragmentation tree.
 * @returns The demo view.
 */
export default function Fragmentation() {
  return (
    <div
      style={{
        border: '1px solid red',
        overflow: 'clip',
      }}
    >
      <TreeSvg
        tree={tree}
        nodeRenderer={moleculeRenderer<ReactionNode>}
        arrowRendererOptions={{
          getLabel: (node) => `Hello\n${node.reaction?.label}\nWorld`,
          verticalPosition: 'top',
          horizontalPosition: 'left',
        }}
        nodeRendererOptions={{
          getTopLabel: (node) => {
            const mz = node.molecules[0]?.info?.mz;
            if (mz === undefined) return;
            return `${mz.toFixed(4)} m/z`;
          },
          getBoxStyle: (node) => {
            for (const molecule of node.molecules) {
              if (isInRange(masses, molecule.info?.mz, accuracy)) {
                return { fillOpacity: 0.2, fill: 'red' };
              }
            }
            return undefined;
          },
          getMoleculeStyle: (molecule, node, index) => {
            if (node.depth) return undefined;
            if (index === 0) return { fill: 'green', fillOpacity: 0.4 };
            if (index === 1) return { fill: 'blue', fillOpacity: 0.4 };
            return undefined;
          },
          getMolecules: (node) =>
            node.molecules.map((molecule) => {
              if (molecule.idCode) return Molecule.fromIDCode(molecule.idCode);
              if (molecule.smiles) return Molecule.fromSmiles(molecule.smiles);
              return null;
            }),
        }}
        positionOptions={{ spacingHorizontal: 150 }}
        shouldSkipBranch={(node) => node.skipBranch === true}
      />
    </div>
  );
}

function isInRange(
  masses: number[],
  mass: number | undefined,
  accuracy: number,
): boolean {
  if (!mass) {
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
