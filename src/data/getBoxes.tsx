import type { ReactElement } from 'react';

import type { PositionedNode } from '../types/tree.ts';

/**
 * One translated SVG group per node, each holding the node's drawing.
 * @param nodes - Positioned nodes, in drawing order.
 * @param getID - Id stamped on each node's group.
 * @returns One `<g>` element per node, moved to the node's coordinates.
 */
export function getBoxes<TNode>(
  nodes: ReadonlyArray<PositionedNode<TNode>>,
  getID?: (node: TNode) => string | undefined,
): ReactElement[] {
  const boxes: ReactElement[] = [];
  for (const node of nodes) {
    boxes.push(
      <g
        id={getID?.(node.node)}
        key={node.key}
        transform={`translate(${node.x} ${node.y})`}
      >
        {node.element}
      </g>,
    );
  }
  return boxes;
}
