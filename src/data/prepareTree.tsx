import type {
  LayoutTreeOptions,
  NodeOverflow,
  PositionedNode,
} from '../types/tree.ts';

/**
 * Render every node of the tree, depth first, and wrap each one with its
 * drawing and the size of its box. The caller's nodes are neither copied nor
 * changed: each wrapper holds the node itself.
 * @param tree - Root nodes of the tree.
 * @param options - Node renderer, its options, the branches to skip and the keys.
 * @returns The wrapped roots, their descendants under `children`, not yet placed.
 */
export function prepareTree<TNode extends object, TOptions>(
  tree: readonly TNode[],
  options: LayoutTreeOptions<TNode, TOptions>,
): Array<PositionedNode<TNode>> {
  return prepareNodes(tree, undefined, [], { options, index: 0 });
}

interface PrepareState<TNode, TOptions> {
  options: LayoutTreeOptions<TNode, TOptions>;
  /** Depth-first position of the next node: its key when there is no `getKey`. */
  index: number;
}

function prepareNodes<TNode extends object, TOptions>(
  nodes: readonly TNode[],
  parent: PositionedNode<TNode> | undefined,
  ancestors: TNode[],
  state: PrepareState<TNode, TOptions>,
): Array<PositionedNode<TNode>> {
  const { nodeRenderer, nodeRendererOptions, shouldSkipBranch, getKey } =
    state.options;
  const rendererOptions = (nodeRendererOptions ?? {}) as TOptions;
  const depth = ancestors.length;
  const prepared: Array<PositionedNode<TNode>> = [];
  for (const node of nodes) {
    const rendered = nodeRenderer(node, rendererOptions, {
      parent: parent?.node,
      depth,
    });
    const positioned: PositionedNode<TNode> = {
      node,
      key: getKey ? getKey(node) : state.index,
      depth,
      parent,
      children: [],
      x: 0,
      y: 0,
      width: rendered.width,
      height: rendered.height,
      overflow: resolveOverflow(rendered.overflow),
      element: rendered.element,
    };
    state.index++;
    prepared.push(positioned);

    const children = childrenOf(node);
    if (!children) continue;
    const parents: [TNode, ...TNode[]] = [node, ...ancestors];
    const kept = shouldSkipBranch
      ? children.filter((child) => !shouldSkipBranch(child, parents))
      : children;
    positioned.children = prepareNodes(kept, positioned, parents, state);
  }
  return prepared;
}

function childrenOf<TNode extends object>(
  node: TNode,
): readonly TNode[] | undefined {
  const { children } = node as { children?: readonly TNode[] | null };
  if (!children || children.length === 0) return undefined;
  return children;
}

function resolveOverflow(overflow: Partial<NodeOverflow> = {}): NodeOverflow {
  const { top = 0, right = 0, bottom = 0, left = 0 } = overflow;
  return { top, right, bottom, left };
}
