import type { ReactElement } from 'react';

import { Arrow } from '../components/Arrow.tsx';
import type { ArrowRendererOptions } from '../types/drawing.ts';
import type { TreeConnector } from '../types/tree.ts';

/**
 * Build the arrows that link each parent node to its children.
 * @param connectors - The parent-to-child links of a laid-out tree.
 * @param options - Label, id, shape and style of the arrows.
 * @param markerId - Id of the arrowhead marker, or undefined for no heads.
 * @returns One arrow element per link.
 */
export function getArrows<TNode>(
  connectors: ReadonlyArray<TreeConnector<TNode>>,
  options: ArrowRendererOptions<TNode>,
  markerId: string | undefined,
): ReactElement[] {
  const {
    getLabel,
    getID,
    horizontalPosition,
    verticalPosition,
    shape,
    className,
    style,
  } = options;
  const arrows: ReactElement[] = [];
  for (const { key, parent, child, from, to } of connectors) {
    arrows.push(
      <Arrow
        key={key}
        id={getID?.(parent.node, child.node)}
        from={from}
        to={to}
        label={getLabel?.(child.node)}
        horizontalPosition={horizontalPosition}
        verticalPosition={verticalPosition}
        markerId={markerId}
        shape={shape}
        className={
          typeof className === 'function'
            ? className(child.node, parent.node)
            : className
        }
        style={
          typeof style === 'function' ? style(child.node, parent.node) : style
        }
      />,
    );
  }
  return arrows;
}
