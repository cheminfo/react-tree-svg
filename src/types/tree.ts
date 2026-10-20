import type { Key, ReactNode } from 'react';

import type { Point } from './Point.ts';

/** How far a node's drawing reaches outside its box on each side, in user units. */
export interface NodeOverflow {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** What a node renderer returns: the drawing of one node and the size of its box. */
export interface RenderedNode {
  /** Width of the node's box: boxes and connectors are placed from it. */
  width: number;
  /** Height of the node's box. */
  height: number;
  /** The drawing, its origin at the top-left corner of the box. */
  element: ReactNode;
  /**
   * How far the drawing reaches outside its box: a label above it, a button
   * astride its edge. The drawing's bounds grow to hold it; boxes do not move.
   * @default no overflow on any side
   */
  overflow?: Partial<NodeOverflow>;
}

/** Where a node sits in the tree, handed to the node renderer with the node. */
export interface NodeRenderContext<TNode> {
  /** The node's parent, or `undefined` for a root. */
  parent: TNode | undefined;
  /** The node's depth: 0 for a root. */
  depth: number;
}

/**
 * Draws one node and reports the size of its box. It is a plain function, not
 * a component: it must not call hooks, but the element it returns may.
 */
export type NodeRenderer<TNode, TOptions> = (
  node: TNode,
  options: TOptions,
  context: NodeRenderContext<TNode>,
) => RenderedNode;

/** Where the tree starts and how far apart its nodes sit, in user units. */
export interface PositionOptions {
  /**
   * Left edge of the roots.
   * @default 0
   */
  x?: number;
  /**
   * Top of the first root's subtree; the room above it holds the labels a
   * renderer draws over the first box.
   * @default 22
   */
  y?: number;
  /**
   * Vertical gap between two sibling subtrees.
   * @default 30
   */
  spacingVertical?: number;
  /**
   * Horizontal gap between a node and its children.
   * @default 140
   */
  spacingHorizontal?: number;
}

/** How a tree is laid out: the node renderer, its options, the spacing, the branches to skip and the keys. */
export interface LayoutTreeOptions<TNode, TOptions> {
  /** Draws each node and reports the size of its box. */
  nodeRenderer: NodeRenderer<TNode, TOptions>;
  /**
   * Passed to the renderer as its second argument.
   * @default {}
   */
  nodeRendererOptions?: TOptions;
  /**
   * Where the tree starts and how far apart its nodes sit.
   * @default {}
   */
  positionOptions?: PositionOptions;
  /**
   * Leaves a child and its descendants out of the drawing when it returns
   * true. `parents` lists the child's ancestors, its parent first.
   * @default undefined — nothing is skipped
   */
  shouldSkipBranch?: (node: TNode, parents: [TNode, ...TNode[]]) => boolean;
  /**
   * A key unique among the drawn nodes, so that React keeps a node's elements
   * (and their focus) when nodes are added, removed or reordered.
   * @default the node's position in depth-first order
   */
  getKey?: (node: TNode) => Key;
}

/** One node of a laid-out tree: the caller's node, its box and its drawing. */
export interface PositionedNode<TNode> {
  /** The caller's own node, neither copied nor changed. */
  node: TNode;
  /** From `getKey`, or the node's position in depth-first order. */
  key: Key;
  /** 0 for a root. */
  depth: number;
  /** The parent, or `undefined` for a root. */
  parent: PositionedNode<TNode> | undefined;
  /** The drawn children: empty for a leaf, or when every child was skipped. */
  children: Array<PositionedNode<TNode>>;
  /** Left edge of the box. */
  x: number;
  /** Top edge of the box. */
  y: number;
  /** Width of the box, from the renderer. */
  width: number;
  /** Height of the box, from the renderer. */
  height: number;
  /** How far the drawing reaches outside the box, from the renderer. */
  overflow: NodeOverflow;
  /** The drawing, from the renderer, its origin at the box's top-left corner. */
  element: ReactNode;
}

/** The link from a parent to one of its children. */
export interface TreeConnector<TNode> {
  /** The child's key when `getKey` is given, or the connector's index. */
  key: Key;
  /** The node the connector starts from. */
  parent: PositionedNode<TNode>;
  /** The node the connector ends at. */
  child: PositionedNode<TNode>;
  /** Middle of the parent box's right edge. */
  from: Point;
  /** Middle of the child box's left edge. */
  to: Point;
}

/** A rectangle, in user units. */
export interface TreeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A tree laid out by `layoutTree`, ready to be drawn. */
export interface TreeLayout<TNode> {
  /** The roots, their descendants under `children`. */
  roots: Array<PositionedNode<TNode>>;
  /** Every node, depth first: a parent before its children. */
  nodes: Array<PositionedNode<TNode>>;
  /** Every parent-to-child link, a parent's links before its children's. */
  connectors: Array<TreeConnector<TNode>>;
  /**
   * What the drawing shows: the frame the layout reserves (from the origin to
   * the widest subtree, the margins included), grown to hold every box and
   * what its renderer declared in `overflow`.
   */
  bounds: TreeBounds;
}
