import OCL from 'openchemlib/core';

import { render } from '..';
import { getData } from '../data/demo/molecules';

test('render: Molecule', () => {
  const data = getData();
  const svg = render(data, {
    nodeRenderer: 'molecule',
    nodeRendererOptions: { OCL },
    positionOptions: {
      spacingHorizontal: 150,
    },
  });
  const match = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/,
  );
  const size = match?.groups;
  expect(Number(size?.width)).toBe(188);
  expect(Number(size?.height)).toBe(156);
});
