import type { NodeRenderer } from '../types/tree.ts';

export interface SimpleNode {
  name: string;
  children?: SimpleNode[] | null;
}

/**
 * A fresh copy of the tree a(b, c(d, e)), f(g); `b` has an empty children
 * array and `g` has `children: null`.
 * @returns The roots.
 */
export function getSimpleTree(): SimpleNode[] {
  return [
    {
      name: 'a',
      children: [
        { name: 'b', children: [] },
        { name: 'c', children: [{ name: 'd' }, { name: 'e' }] },
      ],
    },
    { name: 'f', children: [{ name: 'g', children: null }] },
  ];
}

/**
 * Draws every node as a 60 × 20 box carrying its name.
 * @param node - The node.
 * @returns The box and its size.
 */
export const boxRenderer: NodeRenderer<SimpleNode, unknown> = (node) => ({
  width: 60,
  height: 20,
  element: <rect width={60} height={20} data-name={node.name} />,
});
