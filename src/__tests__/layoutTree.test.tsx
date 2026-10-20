import { expect, test } from 'vitest';

import type { NodeRenderContext, TreeLayout } from '../index.ts';
import { layoutTree } from '../index.ts';

import type { SimpleNode } from './fixtures.tsx';
import { boxRenderer, getSimpleTree } from './fixtures.tsx';

function summarize(layout: TreeLayout<SimpleNode>) {
  return {
    nodes: layout.nodes.map(({ node, key, depth, x, y, width, height }) => ({
      name: node.name,
      key,
      depth,
      x,
      y,
      width,
      height,
    })),
    connectors: layout.connectors.map(({ key, parent, child, from, to }) => ({
      key,
      link: `${parent.node.name}-${child.node.name}`,
      from,
      to,
    })),
  };
}

test('layoutTree places every node and links each parent to its children', () => {
  const layout = layoutTree(getSimpleTree(), { nodeRenderer: boxRenderer });

  expect(summarize(layout)).toStrictEqual({
    nodes: [
      { name: 'a', key: 0, depth: 0, x: 0, y: 72, width: 60, height: 20 },
      { name: 'b', key: 1, depth: 1, x: 200, y: 22, width: 60, height: 20 },
      { name: 'c', key: 2, depth: 1, x: 200, y: 97, width: 60, height: 20 },
      { name: 'd', key: 3, depth: 2, x: 400, y: 72, width: 60, height: 20 },
      { name: 'e', key: 4, depth: 2, x: 400, y: 122, width: 60, height: 20 },
      { name: 'f', key: 5, depth: 0, x: 0, y: 172, width: 60, height: 20 },
      { name: 'g', key: 6, depth: 1, x: 200, y: 172, width: 60, height: 20 },
    ],
    connectors: [
      { key: 0, link: 'a-b', from: { x: 60, y: 82 }, to: { x: 200, y: 32 } },
      { key: 1, link: 'a-c', from: { x: 60, y: 82 }, to: { x: 200, y: 107 } },
      { key: 2, link: 'c-d', from: { x: 260, y: 107 }, to: { x: 400, y: 82 } },
      { key: 3, link: 'c-e', from: { x: 260, y: 107 }, to: { x: 400, y: 132 } },
      { key: 4, link: 'f-g', from: { x: 60, y: 182 }, to: { x: 200, y: 182 } },
    ],
  });
  expect(layout.bounds).toStrictEqual({ x: 0, y: 0, width: 460, height: 200 });
  expect(layout.roots.map((root) => root.node.name)).toStrictEqual(['a', 'f']);
  expect(layout.nodes[2]?.parent).toBe(layout.roots[0]);
  expect(
    layout.nodes[2]?.children.map((child) => child.node.name),
  ).toStrictEqual(['d', 'e']);
});

test('getKey keys the nodes, and each connector takes the key of its child', () => {
  const layout = layoutTree(getSimpleTree(), {
    nodeRenderer: boxRenderer,
    getKey: (node) => `taxon-${node.name}`,
  });

  expect(layout.nodes.map((node) => node.key)).toStrictEqual([
    'taxon-a',
    'taxon-b',
    'taxon-c',
    'taxon-d',
    'taxon-e',
    'taxon-f',
    'taxon-g',
  ]);
  expect(layout.connectors.map((connector) => connector.key)).toStrictEqual([
    'taxon-b',
    'taxon-c',
    'taxon-d',
    'taxon-e',
    'taxon-g',
  ]);
});

test('the renderer gets the caller’s own nodes, depth first, and the tree is left untouched', () => {
  const tree = getSimpleTree();
  const copy = structuredClone(tree);
  const calls: Array<{ node: SimpleNode; options: unknown; parent?: string }> =
    [];
  const depths: number[] = [];
  const layout = layoutTree(tree, {
    nodeRenderer: (
      node: SimpleNode,
      options: unknown,
      context: NodeRenderContext<SimpleNode>,
    ) => {
      calls.push({ node, options, parent: context.parent?.name });
      depths.push(context.depth);
      return boxRenderer(node, options, context);
    },
  });

  expect(calls.map((call) => call.node.name)).toStrictEqual([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
  ]);
  expect(calls.map((call) => call.parent)).toStrictEqual([
    undefined,
    'a',
    'a',
    'c',
    'c',
    undefined,
    'f',
  ]);
  expect(depths).toStrictEqual([0, 1, 1, 2, 2, 0, 1]);
  expect(calls[0]?.options).toStrictEqual({});
  expect(calls[0]?.node).toBe(tree[0]);
  expect(layout.nodes[1]?.node).toBe(tree[0]?.children?.[0]);
  expect(tree).toStrictEqual(copy);
});

test('shouldSkipBranch leaves a branch out and is given the ancestors, parent first', () => {
  const asked: string[] = [];
  const tree = [{ name: 'a', children: getSimpleTree() }];
  const layout = layoutTree(tree, {
    nodeRenderer: boxRenderer,
    shouldSkipBranch: (node, parents) => {
      asked.push(
        `${node.name}<${parents.map((parent) => parent.name).join('<')}`,
      );
      return node.name === 'c';
    },
  });

  expect(asked).toStrictEqual(['a<a', 'f<a', 'b<a<a', 'c<a<a', 'g<f<a']);
  expect(layout.nodes.map((node) => node.node.name)).toStrictEqual([
    'a',
    'a',
    'b',
    'f',
    'g',
  ]);
  expect(layout.connectors.map((connector) => connector.key)).toStrictEqual([
    0, 1, 2, 3,
  ]);
});

test('a node whose children are all skipped is laid out as a leaf', () => {
  const layout = layoutTree([{ name: 'f', children: [{ name: 'g' }] }], {
    nodeRenderer: boxRenderer,
    shouldSkipBranch: () => true,
  });

  expect(layout.nodes[0]?.children).toStrictEqual([]);
  expect(layout.connectors).toStrictEqual([]);
  expect(layout.bounds).toStrictEqual({ x: 0, y: 0, width: 60, height: 50 });
});

test('an empty tree has empty bounds', () => {
  const layout = layoutTree([], { nodeRenderer: boxRenderer });

  expect(layout).toStrictEqual({
    roots: [],
    nodes: [],
    connectors: [],
    bounds: { x: 0, y: 0, width: 0, height: 0 },
  });
});
