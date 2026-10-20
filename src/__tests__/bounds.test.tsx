import { expect, test } from 'vitest';

import type { NodeOverflow } from '../index.ts';
import { layoutTree } from '../index.ts';

import type { SimpleNode } from './fixtures.tsx';
import { boxRenderer, getSimpleTree } from './fixtures.tsx';

test('the bounds grow to hold what a renderer declares overflowing its box', () => {
  const overflows: Record<string, Partial<NodeOverflow>> = {
    a: { top: 15, left: 4 },
    b: { right: 12, bottom: 6 },
  };
  const layout = layoutTree([{ name: 'a', children: [{ name: 'b' }] }], {
    nodeRenderer: (node: SimpleNode) => ({
      ...boxRenderer(node, undefined, { parent: undefined, depth: 0 }),
      overflow: overflows[node.name],
    }),
    positionOptions: { y: 0, spacingVertical: 0 },
  });

  expect(
    layout.nodes.map(({ x, y, overflow }) => ({ x, y, overflow })),
  ).toStrictEqual([
    { x: 0, y: 0, overflow: { top: 15, right: 0, bottom: 0, left: 4 } },
    { x: 200, y: 0, overflow: { top: 0, right: 12, bottom: 6, left: 0 } },
  ]);
  expect(layout.bounds).toStrictEqual({
    x: -4,
    y: -15,
    width: 276,
    height: 41,
  });
});

test('an overflow inside the frame leaves the bounds as they are', () => {
  const layout = layoutTree(getSimpleTree(), {
    nodeRenderer: (node: SimpleNode) => ({
      ...boxRenderer(node, undefined, { parent: undefined, depth: 0 }),
      overflow: { top: 20 },
    }),
  });

  expect(layout.bounds).toStrictEqual({ x: 0, y: 0, width: 460, height: 200 });
});

test('the bounds hold the last subtree when the vertical spacing is smaller than the top margin', () => {
  const layout = layoutTree(getSimpleTree(), {
    nodeRenderer: boxRenderer,
    positionOptions: { spacingVertical: 10, spacingHorizontal: 20 },
  });

  const last = layout.nodes.at(-1);

  expect(last?.y).toBe(112);
  expect(layout.bounds).toStrictEqual({ x: 0, y: 0, width: 220, height: 132 });
});

test('the origin moves the boxes and the bounds follow them', () => {
  const layout = layoutTree(getSimpleTree(), {
    nodeRenderer: boxRenderer,
    positionOptions: { x: 40, y: -10 },
  });

  expect(layout.nodes[0]).toMatchObject({ x: 40, y: 40 });
  expect(layout.bounds).toStrictEqual({
    x: 0,
    y: -10,
    width: 500,
    height: 210,
  });
});

test('a rounding difference between the frame and a box does not grow the bounds', () => {
  const layout = layoutTree(
    [{ name: 'a', children: [{ name: 'b', children: [{ name: 'c' }] }] }],
    {
      nodeRenderer: () => ({ width: 0.1, height: 20, element: null }),
      positionOptions: { spacingHorizontal: 0.7 },
    },
  );
  const leaf = layout.nodes.at(-1);

  expect((leaf?.x ?? 0) + (leaf?.width ?? 0)).toBe(1.7);
  expect(layout.bounds.width).toBe(1.6999999999999997);
});
