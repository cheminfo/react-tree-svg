import type { PositionOptions, PositionedNode } from '../types/tree.ts';

interface Size {
  width: number;
  height: number;
}

interface Spacing {
  vertical: number;
  horizontal: number;
}

/**
 * Assign x/y coordinates to every node in place, stacking sibling subtrees
 * vertically, centring each node on its subtree and spreading tree depth
 * horizontally.
 * @param roots - Nodes to lay out; their `x` and `y` are written in place.
 * @param options - Layout origin and spacing between nodes.
 * @returns The frame the layout reserves, from (0, 0): as wide as the widest
 * subtree, and as tall as the subtrees with the spacing below each root.
 */
export function calculatePosition<TNode>(
  roots: ReadonlyArray<PositionedNode<TNode>>,
  options: PositionOptions = {},
): Size {
  const {
    x = 0,
    y = 22,
    spacingVertical = 30,
    spacingHorizontal = 140,
  } = options;
  const spacing = { vertical: spacingVertical, horizontal: spacingHorizontal };
  const blocks = new Map<PositionedNode<TNode>, Size>();
  for (const root of roots) {
    measureBlock(root, spacing, blocks);
  }
  placeNodes(roots, x, y, spacing, blocks);

  const frame = { width: 0, height: 0 };
  for (const root of roots) {
    const block = blocks.get(root) as Size;
    frame.width = Math.max(frame.width, block.width);
    frame.height += block.height + spacingVertical;
  }
  return frame;
}

/**
 * Size of the block a node and its descendants need, recorded for every node
 * of the subtree.
 * @param node - Root of the subtree.
 * @param spacing - Gaps between subtrees and between depths.
 * @param blocks - Where each node's block is recorded.
 * @returns The size of the node's block.
 */
function measureBlock<TNode>(
  node: PositionedNode<TNode>,
  spacing: Spacing,
  blocks: Map<PositionedNode<TNode>, Size>,
): Size {
  let block: Size = { width: node.width, height: node.height };
  if (node.children.length > 0) {
    let widest = -Infinity;
    let total = 0;
    for (const child of node.children) {
      const childBlock = measureBlock(child, spacing, blocks);
      widest = Math.max(widest, childBlock.width);
      total += childBlock.height;
    }
    block = {
      width: node.width + spacing.horizontal + widest,
      height: Math.max(
        node.height,
        spacing.vertical * (node.children.length - 1) + total,
      ),
    };
  }
  blocks.set(node, block);
  return block;
}

function placeNodes<TNode>(
  nodes: ReadonlyArray<PositionedNode<TNode>>,
  x: number,
  top: number,
  spacing: Spacing,
  blocks: Map<PositionedNode<TNode>, Size>,
): void {
  let y = top;
  for (const node of nodes) {
    const block = blocks.get(node) as Size;
    placeNodes(
      node.children,
      x + node.width + spacing.horizontal,
      y,
      spacing,
      blocks,
    );
    node.x = x;
    node.y = block.height / 2 - node.height / 2 + y;
    y += block.height + spacing.vertical;
  }
}
