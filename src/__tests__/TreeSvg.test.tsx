import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { TreeSvg } from '../index.ts';

import type { SimpleNode } from './fixtures.tsx';
import { boxRenderer, getSimpleTree } from './fixtures.tsx';

function draw(element: ReactElement): HTMLDivElement {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(element);
  return container;
}

function attributes(elements: Iterable<Element>, name: string) {
  return Array.from(elements, (element) => element.getAttribute(name));
}

test('TreeSvg draws the connectors beneath the boxes', () => {
  const svg = draw(
    <TreeSvg tree={getSimpleTree()} nodeRenderer={boxRenderer} />,
  ).querySelector('svg');
  const layers = Array.from(svg?.children ?? [], (child) => {
    if (child.tagName === 'defs') return 'marker';
    return child.hasAttribute('transform') ? 'box' : 'connector';
  });

  expect(layers).toStrictEqual([
    'marker',
    ...Array.from({ length: 5 }, () => 'connector'),
    ...Array.from({ length: 7 }, () => 'box'),
  ]);
  expect(svg?.getAttribute('viewBox')).toBe('0 0 460 200');
});

test('each tree has its own arrowhead marker, and its connectors refer to it', () => {
  const container = draw(
    <div>
      <TreeSvg tree={getSimpleTree()} nodeRenderer={boxRenderer} />
      <TreeSvg tree={getSimpleTree()} nodeRenderer={boxRenderer} />
    </div>,
  );
  const svgs = Array.from(container.querySelectorAll('svg'));
  const markerIds = svgs.map((svg) => svg.querySelector('marker')?.id ?? '');

  expect(markerIds[0]).not.toBe(markerIds[1]);

  for (const [index, svg] of svgs.entries()) {
    expect(markerIds[index]).toMatch(/-arrowhead$/);
    expect(
      new Set(attributes(svg.querySelectorAll('path'), 'marker-end')),
    ).toStrictEqual(new Set([`url(#${markerIds[index]})`]));
  }
});

test('idPrefix names the marker', () => {
  const container = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      idPrefix="tree-a"
    />,
  );

  expect(container.querySelector('marker')?.id).toBe('tree-a-arrowhead');
  expect(container.querySelector('path')?.getAttribute('marker-end')).toBe(
    'url(#tree-a-arrowhead)',
  );
});

test('the default look of a connector is written as presentation attributes', () => {
  const path = draw(
    <TreeSvg tree={getSimpleTree()} nodeRenderer={boxRenderer} />,
  ).querySelector('path');

  expect(
    ['fill', 'stroke', 'stroke-width', 'style'].map((name) =>
      path?.getAttribute(name),
    ),
  ).toStrictEqual(['none', 'black', '2', null]);
});

test('arrowHead: false draws curves without heads, and no marker', () => {
  const container = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      arrowRendererOptions={{ arrowHead: false }}
    />,
  );
  const paths = container.querySelectorAll('path');

  expect(container.querySelector('defs')).toBeNull();
  expect(attributes(paths, 'marker-end')).toStrictEqual([
    null,
    null,
    null,
    null,
    null,
  ]);
  expect(paths[0]?.getAttribute('d')).toBe('M 60 82 C 130 82 130 32 200 32');
});

test('shape draws elbows', () => {
  const container = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      arrowRendererOptions={{ shape: 'elbow' }}
    />,
  );

  expect(attributes(container.querySelectorAll('path'), 'd')).toStrictEqual([
    'M 60 82 H 130 V 32 H 200',
    'M 60 82 H 130 V 107 H 200',
    'M 260 107 H 330 V 82 H 400',
    'M 260 107 H 330 V 132 H 400',
    'M 60 182 H 130 V 182 H 200',
  ]);
});

test('className and style apply to every connector', () => {
  const paths = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      arrowRendererOptions={{
        className: 'branch',
        style: { strokeDasharray: '4 2' },
      }}
    />,
  ).querySelectorAll('path');

  expect(new Set(attributes(paths, 'class'))).toStrictEqual(
    new Set(['branch']),
  );
  expect(new Set(attributes(paths, 'style'))).toStrictEqual(
    new Set(['stroke-dasharray:4 2']),
  );
});

test('className and style callbacks pick connectors from their child and parent', () => {
  const paths = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      arrowRendererOptions={{
        className: (child) => (child.name === 'c' ? 'lineage' : undefined),
        style: (child, parent) =>
          parent.name === 'c' ? { stroke: 'red' } : undefined,
      }}
    />,
  ).querySelectorAll('path');

  expect(attributes(paths, 'class')).toStrictEqual([
    null,
    'lineage',
    null,
    null,
    null,
  ]);
  expect(attributes(paths, 'style')).toStrictEqual([
    null,
    null,
    'stroke:red',
    'stroke:red',
    null,
  ]);
});

test('a connector takes its label from the child and its id from both ends', () => {
  const container = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      arrowRendererOptions={{
        getLabel: (child) => child.name.toUpperCase(),
        getID: (parent, child) => `${parent.name}-${child.name}`,
      }}
    />,
  );
  const groups = Array.from(container.querySelectorAll('svg > g')).slice(0, 5);

  expect(attributes(groups, 'id')).toStrictEqual([
    'a-b',
    'a-c',
    'c-d',
    'c-e',
    'f-g',
  ]);
  expect(
    groups.map((group) => group.querySelectorAll('text')[1]?.textContent),
  ).toStrictEqual(['B', 'C', 'D', 'E', 'G']);
});

test('the getID of the node renderer options stamps each node group', () => {
  const container = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={(
        node: SimpleNode,
        options: { getID: (node: SimpleNode) => string },
      ) => boxRenderer(node, options, { parent: undefined, depth: 0 })}
      nodeRendererOptions={{ getID: (node) => `box-${node.name}` }}
    />,
  );

  expect(
    attributes(container.querySelectorAll('svg > g[transform]'), 'id'),
  ).toStrictEqual([
    'box-a',
    'box-b',
    'box-c',
    'box-d',
    'box-e',
    'box-f',
    'box-g',
  ]);
});

test('svgProps reach the svg, and a viewBox there replaces the computed one', () => {
  const svg = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={boxRenderer}
      svgProps={{ className: 'tree', width: 230, viewBox: '0 0 10 10' }}
    />,
  ).querySelector('svg');

  expect(attributes([svg as Element], 'class')).toStrictEqual(['tree']);
  expect(attributes([svg as Element], 'width')).toStrictEqual(['230']);
  expect(attributes([svg as Element], 'viewBox')).toStrictEqual(['0 0 10 10']);
});

test('the viewBox holds what the renderer declares overflowing the boxes', () => {
  const svg = draw(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={(node: SimpleNode) => ({
        ...boxRenderer(node, undefined, { parent: undefined, depth: 0 }),
        overflow: { top: 30 },
      })}
      positionOptions={{ y: 0 }}
    />,
  ).querySelector('svg');

  expect(svg?.getAttribute('viewBox')).toBe('0 -30 460 230');
});
