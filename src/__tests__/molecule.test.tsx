import OCL from 'openchemlib/core';

import { render } from '..';
import { getData } from '../demo/data/molecules';
import { moleculeRenderer } from '../nodeRenderer/moleculeRenderer';

test('render: Molecule', () => {
  const data = getData();
  const svg = render(data, {
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
        if (node.smiles) {
          return [OCL.Molecule.fromSmiles(node.smiles)];
        }
        if (node.idCode) {
          return [OCL.Molecule.fromIDCode(node.idCode)];
        }
        return [];
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
  expect(Number(size?.height)).toBe(156);
  expect(svg).toMatchSnapshot();
});
