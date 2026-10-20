import { Molecule } from 'openchemlib';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { reactionTree } from '../../demo/data/reactionTree.ts';
import { render } from '../index.ts';
import { moleculeRenderer } from '../nodeRenderer/moleculeRenderer.tsx';

test('render: Molecule', () => {
  const svg = render(reactionTree, {
    nodeRenderer: moleculeRenderer,
    nodeRendererOptions: {
      getTopLabel: (node) => {
        return node.label;
      },
      getBoxStyle: () => {
        return {
          fillOpacity: 0.2,
          fill: 'red',
        };
      },

      getMolecules: (node) => {
        return node.molecules.map((molecule: { idCode: string }) =>
          Molecule.fromIDCode(molecule.idCode),
        );
      },
    },
    arrowRendererOptions: {
      getLabel: (node) => {
        return (node as { transformation?: string }).transformation;
      },
      horizontalPosition: 'center',
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

interface MoleculeNode {
  smiles: string[];
  label?: string;
}

test('moleculeRenderer declares the room its top label takes above the box', () => {
  const withLabel = moleculeRenderer<MoleculeNode>(
    { smiles: [], label: '194.1173 m/z' },
    { getMolecules: () => [] },
  );
  const withoutLabel = moleculeRenderer<MoleculeNode>(
    { smiles: [] },
    { getMolecules: () => [] },
  );

  expect([withLabel.width, withLabel.height]).toStrictEqual([200, 20]);
  expect(withLabel.overflow).toStrictEqual({ top: 20 });
  expect([withoutLabel.width, withoutLabel.height]).toStrictEqual([0, 0]);
  expect(withoutLabel.overflow).toBeUndefined();
});

test('moleculeRenderer leaves out empty molecules and numbers the others for getMoleculeStyle', () => {
  const styled: Array<[string, number]> = [];
  moleculeRenderer<MoleculeNode>(
    { smiles: ['', 'CCO', 'C'] },
    {
      getMolecules: (node) =>
        node.smiles.map((smiles) =>
          smiles ? Molecule.fromSmiles(smiles) : null,
        ),
      getMoleculeStyle: (molecule, node, index) => {
        styled.push([molecule.getMolecularFormula().formula, index]);
        return undefined;
      },
    },
  );

  expect(styled).toStrictEqual([
    ['C2H6O', 0],
    ['CH4', 1],
  ]);
});

test('getMoleculeStyle paints a rectangle behind the molecule, its style in kebab case', () => {
  const rendered = moleculeRenderer<MoleculeNode>(
    { smiles: ['CCO'] },
    {
      getMolecules: (node) =>
        node.smiles.map((smiles) => Molecule.fromSmiles(smiles)),
      getMoleculeStyle: () => ({ fillOpacity: 0.4, fill: 'green' }),
    },
  );
  const markup = renderToStaticMarkup(rendered.element);

  expect(markup).toMatch(
    /<svg [^>]*><rect x="-?\d+" y="-?\d+" width="\d+" height="\d+" style="fill-opacity: 0.4; fill: green"><\/rect>/,
  );
});
