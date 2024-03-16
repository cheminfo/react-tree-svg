import OCL from 'openchemlib/core';
import { test, expect } from 'vitest';

import { render } from '..';
import { reactionTree } from '../demo/data/reactionTree';
import { moleculeRenderer } from '../nodeRenderer/moleculeRenderer';

test('render: Molecule', () => {
  const svg = render(reactionTree, {
    nodeRenderer: moleculeRenderer,
    nodeRendererOptions: {
      getTopLabel: (node) => {
        return node.label;
      },
      getBoxStyle: (node) => {
        return {
          fillOpacity: 0.2,
          fill: 'red',
        };
      },

      getMolecules: (node) => {
        return node.molecules.map((molecule) =>
          OCL.Molecule.fromIDCode(molecule.idCode),
        );
      },
    },
    arrowRendererOptions: {
      getLabel: (node) => {
        return node.transformation;
      },
      labelPosition: 'center',
    },
    positionOptions: {
      spacingHorizontal: 150,
    },
  });
  const match = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/,
  );
  const size = match?.groups;
  expect(Number(size?.height)).toBe(96);
  expect(svg).toMatchSnapshot();
});
