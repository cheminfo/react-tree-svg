import type { CSSProperties, SVGProps } from 'react';

import type { LayoutTreeOptions } from './tree.ts';

/**
 * How a connector runs from a parent to a child: an S-shaped curve, a straight
 * line, or horizontal, vertical, then horizontal again.
 */
export type ConnectorShape = 'curve' | 'straight' | 'elbow';

/** How the connectors linking each parent to its children are drawn. */
export interface ArrowRendererOptions<TNode> {
  /**
   * Text drawn along the connector into a child; it may hold newlines.
   * @default undefined — no label
   */
  getLabel?: (child: TNode) => string | undefined;
  /**
   * Where the label sits along the connector.
   * @default 'center'
   */
  horizontalPosition?: 'left' | 'center' | 'right';
  /**
   * How the label's lines sit around its anchor.
   * @default 'center'
   */
  verticalPosition?: 'top' | 'center' | 'bottom';
  /**
   * Id of a connector's group, from the parent and the child it links.
   * @default undefined — no id
   */
  getID?: (parent: TNode, child: TNode) => string | undefined;
  /**
   * Whether a connector ends with an arrowhead.
   * @default true
   */
  arrowHead?: boolean;
  /**
   * How a connector runs from the parent to the child.
   * @default 'curve'
   */
  shape?: ConnectorShape;
  /**
   * Class of each connector's path: one for all, or one per connector. The
   * default look (a black stroke 2 wide) is written as presentation
   * attributes, so any CSS rule of the class overrides it.
   * @default undefined
   */
  className?: string | ((child: TNode, parent: TNode) => string | undefined);
  /**
   * Inline style of each connector's path, over the default look: one for
   * all, or one per connector.
   * @default undefined
   */
  style?:
    | CSSProperties
    | ((child: TNode, parent: TNode) => CSSProperties | undefined);
}

/** Everything `render` takes besides the tree: how it is laid out and how it is drawn. */
export interface RenderOptions<TNode, TOptions> extends LayoutTreeOptions<
  TNode,
  TOptions
> {
  /**
   * How the connectors are drawn.
   * @default {}
   */
  arrowRendererOptions?: ArrowRendererOptions<TNode>;
  /**
   * Prefix of the ids written into the drawing (the arrowhead marker). Give
   * one per tree when several trees rendered on a server share a page.
   * @default an id from React's `useId`, unique among the trees of a page rendered in the browser
   */
  idPrefix?: string;
  /**
   * Props of the `<svg>` element: `className`, `width`, `ref`, handlers…
   * A `viewBox` given here replaces the one computed from the bounds.
   * @default {}
   */
  svgProps?: SVGProps<SVGSVGElement>;
}

/** The props of `TreeSvg`: the tree, how it is laid out and how it is drawn. */
export interface TreeSvgProps<TNode, TOptions> extends RenderOptions<
  TNode,
  TOptions
> {
  /** Root nodes of the tree; each node's children are in its `children` array. */
  tree: readonly TNode[];
}
