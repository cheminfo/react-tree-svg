import { test, expect } from 'vitest';

import { render } from '..';
import { getDataTaxonomy } from '../../demo/data/taxonomiesWithUrl';
import { taxonomyRenderer } from '../nodeRenderer/taxonomyRenderer';

test.skip('render: Taxonomy', () => {
  const tree = getDataTaxonomy();

  const options = {
    nodeRenderer: taxonomyRenderer,
    arrowRendererOptions: {
      getLabel: () => {},
    },
    nodeRendererOptions: {
      maxRankDepth: 8,
    },
    positionOptions: {
      spacingHorizontal: 100,
    },
  };

  const svg = render(tree, options);
  const match = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/,
  );
  const size = match?.groups;
  expect(Number(size?.height)).toBe(156);
  expect(svg).toMatchSnapshot();
});
