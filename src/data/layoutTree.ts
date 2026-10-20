import type {
  LayoutTreeOptions,
  PositionedNode,
  TreeConnector,
  TreeLayout,
} from '../types/tree.ts';

import { calculatePosition } from './calculatePosition.ts';
import { getBounds } from './getBounds.ts';
import { prepareTree } from './prepareTree.tsx';

/**
 * Lay a tree out without drawing it: render every node, place the boxes and
 * link each parent to its children. It is all an app needs to draw the tree
 * its own way, or to know the drawing's size before drawing it.
 * @param tree - Root nodes of the tree; each node's children are in its `children` array.
 * @param options - Node renderer, its options, the spacing, the branches to skip and the keys.
 * @returns The positioned nodes, the connectors and the bounds of the drawing.
 */
export function layoutTree<TNode extends object, TOptions>(
  tree: readonly TNode[],
  options: LayoutTreeOptions<TNode, TOptions>,
): TreeLayout<TNode> {
  const roots = prepareTree(tree, options);
  const frame = calculatePosition(roots, options.positionOptions);
  const nodes: Array<PositionedNode<TNode>> = [];
  appendNodes(roots, nodes);
  const connectors: Array<TreeConnector<TNode>> = [];
  appendConnectors(roots, connectors, options.getKey !== undefined);
  return { roots, nodes, connectors, bounds: getBounds(nodes, frame) };
}

function appendNodes<TNode>(
  nodes: ReadonlyArray<PositionedNode<TNode>>,
  flat: Array<PositionedNode<TNode>>,
): void {
  for (const node of nodes) {
    flat.push(node);
    appendNodes(node.children, flat);
  }
}

function appendConnectors<TNode>(
  nodes: ReadonlyArray<PositionedNode<TNode>>,
  connectors: Array<TreeConnector<TNode>>,
  keyed: boolean,
): void {
  for (const parent of nodes) {
    if (parent.children.length === 0) continue;
    const fromX = parent.x + parent.width;
    const fromY = parent.y + parent.height / 2;
    for (const child of parent.children) {
      connectors.push({
        key: keyed ? child.key : connectors.length,
        parent,
        child,
        from: { x: fromX, y: fromY },
        to: { x: child.x, y: child.y + child.height / 2 },
      });
    }
    appendConnectors(parent.children, connectors, keyed);
  }
}
