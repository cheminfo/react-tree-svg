import type { ReactElement } from 'react';
import { useId, useMemo } from 'react';

import { getArrows } from '../data/getArrows.tsx';
import { getBoxes } from '../data/getBoxes.tsx';
import { layoutTree } from '../data/layoutTree.ts';
import type { TreeSvgProps } from '../types/drawing.ts';

import { MarkerDef } from './MarkerDef.tsx';

/**
 * Draw a tree as one SVG, sized to fit it, inside the app's own React tree:
 * the boxes of the node renderer, and beneath them the connectors linking
 * each parent to its children. Handlers, state and focus inside the node
 * drawings work as anywhere else in React; give `getKey` so that a node keeps
 * its elements when the tree changes. The layout is computed again only when
 * the tree or a layout option changes: the renderer, its options, the
 * spacing, `shouldSkipBranch` or `getKey`.
 * @param props - The tree, how it is laid out and how it is drawn.
 * @returns The `<svg>` element.
 */
export function TreeSvg<TNode extends object, TOptions>(
  props: TreeSvgProps<TNode, TOptions>,
): ReactElement {
  const {
    tree,
    nodeRenderer,
    nodeRendererOptions,
    positionOptions = {},
    shouldSkipBranch,
    getKey,
    arrowRendererOptions = {},
    idPrefix,
    svgProps,
  } = props;
  const reactId = useId();
  const { x, y, spacingVertical, spacingHorizontal } = positionOptions;
  const layout = useMemo(
    () =>
      layoutTree(tree, {
        nodeRenderer,
        nodeRendererOptions,
        positionOptions: { x, y, spacingVertical, spacingHorizontal },
        shouldSkipBranch,
        getKey,
      }),
    [
      tree,
      nodeRenderer,
      nodeRendererOptions,
      x,
      y,
      spacingVertical,
      spacingHorizontal,
      shouldSkipBranch,
      getKey,
    ],
  );

  const { arrowHead = true } = arrowRendererOptions;
  const markerId = arrowHead ? `${idPrefix ?? reactId}-arrowhead` : undefined;
  const { bounds, connectors, nodes } = layout;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
      {...svgProps}
    >
      {markerId !== undefined && <MarkerDef id={markerId} />}
      {getArrows(connectors, arrowRendererOptions, markerId)}
      {getBoxes(nodes, nodeIdGetter(nodeRendererOptions))}
    </svg>
  );
}

/**
 * The `getID` callback a node renderer's options may carry: the drawing, not
 * the renderer, stamps its result on each node's group.
 * @param options - The node renderer's options.
 * @returns The callback, when there is one.
 */
function nodeIdGetter(
  options: unknown,
): ((node: unknown) => string | undefined) | undefined {
  if (typeof options !== 'object' || options === null) return undefined;
  if (!('getID' in options) || typeof options.getID !== 'function') {
    return undefined;
  }
  return options.getID as (node: unknown) => string | undefined;
}
