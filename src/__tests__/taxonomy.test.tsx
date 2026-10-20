import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';

import type { MeasureText, TaxonomyNode } from '../index.ts';
import { render, taxonomyRenderer } from '../index.ts';

afterEach(() => {
  vi.restoreAllMocks();
});

const tenPerCharacter: MeasureText = (text) => ({
  width: text.length * 10,
  height: 18,
});

test('taxonomyRenderer measures the name with the given measureText, not in the document', () => {
  const append = vi.spyOn(document.body, 'append');
  const measured: Array<[string, string]> = [];
  const rendered = taxonomyRenderer(
    { name: 'Streptomyces melanogenes', rank: 'species', nbTaxonomies: 3 },
    {
      measureText: (text, font) => {
        measured.push([text, font]);
        return tenPerCharacter(text, font);
      },
    },
  );

  expect(measured).toStrictEqual([
    ['Streptomyces melanogenes', '16px Arial, Helvetica, sans-serif'],
  ]);
  expect(append).not.toHaveBeenCalled();
  expect(rendered.width).toBe(248);
  expect(rendered.height).toBe(20);
  expect(rendered.overflow).toStrictEqual({ top: 20 });
});

test('a short name is centred in a box of the minimum width', () => {
  const rendered = taxonomyRenderer(
    { name: 'Bos', rank: '' },
    { measureText: tenPerCharacter },
  );
  const markup = renderToStaticMarkup(rendered.element);

  expect(rendered.width).toBe(120);
  expect(rendered.overflow).toBeUndefined();
  expect(markup).toContain('<text x="45" y="10"');
});

test('without measureText the name is measured in the document', () => {
  const append = vi.spyOn(document.body, 'append');
  const rendered = taxonomyRenderer({ name: 'Bos', rank: 'genus' });

  expect(append).toHaveBeenCalledOnce();
  expect(document.body.childElementCount).toBe(0);
  expect(rendered.width).toBe(120);
});

test('render: Taxonomy', () => {
  const tree: Array<TaxonomyNode & { children?: TaxonomyNode[] }> = [
    {
      name: 'Bacteria',
      rank: 'superkingdom',
      nbTaxonomies: 3,
      children: [
        { name: 'Streptomyces', rank: 'genus', nbTaxonomies: 2 },
        {
          name: 'Bacillus subtilis',
          rank: 'species',
          nbTaxonomies: 1,
          url: 'https://www.ncbi.nlm.nih.gov/taxonomy/1423',
        },
      ],
    },
  ];
  const svg = render(tree, {
    nodeRenderer: taxonomyRenderer,
    nodeRendererOptions: { measureText: tenPerCharacter },
    positionOptions: { spacingHorizontal: 100 },
    idPrefix: 'taxonomy',
  });

  expect(svg).toMatchSnapshot();
});
