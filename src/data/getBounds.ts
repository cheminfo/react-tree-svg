import type { PositionedNode, TreeBounds } from '../types/tree.ts';

/**
 * The frame and the node edges add the same widths in a different order, so
 * they may differ by a rounding error; that is not a reason to grow the frame.
 */
const TOLERANCE = 1e-9;

/**
 * The rectangle a drawing shows: the frame the layout reserves, grown to hold
 * every box and what its renderer declared overflowing it.
 * @param nodes - Every positioned node of the tree.
 * @param frame - Size of the frame the layout reserves, from (0, 0).
 * @param frame.width - Width of the frame.
 * @param frame.height - Height of the frame.
 * @returns The bounds of the drawing.
 */
export function getBounds<TNode>(
  nodes: ReadonlyArray<PositionedNode<TNode>>,
  frame: { width: number; height: number },
): TreeBounds {
  let left = 0;
  let top = 0;
  let right = frame.width;
  let bottom = frame.height;
  for (const { x, y, width, height, overflow } of nodes) {
    if (x - overflow.left < left - TOLERANCE) left = x - overflow.left;
    if (y - overflow.top < top - TOLERANCE) top = y - overflow.top;
    if (x + width + overflow.right > right + TOLERANCE) {
      right = x + width + overflow.right;
    }
    if (y + height + overflow.bottom > bottom + TOLERANCE) {
      bottom = y + height + overflow.bottom;
    }
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}
