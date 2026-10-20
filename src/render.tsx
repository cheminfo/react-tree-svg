import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { TreeSvg } from './components/TreeSvg.tsx';
import type { RenderOptions } from './types/drawing.ts';

/**
 * Render a tree to a standalone SVG markup string: {@link TreeSvg}, rendered
 * synchronously into a detached element. `flushSync` makes the markup ready
 * right away, which is what makes SVG generation outside an app possible; it
 * cannot run while React is rendering, so an app draws {@link TreeSvg} instead.
 * @param tree - Root nodes of the tree to draw.
 * @param options - Node renderer and layout options forwarded to the tree.
 * @returns The SVG document as an HTML string.
 */
export function render<TNode extends object, TOptions>(
  tree: readonly TNode[],
  options: RenderOptions<TNode, TOptions>,
): string {
  const element = <TreeSvg tree={tree} {...options} />;
  const div = document.createElement('div');
  const root = createRoot(div);
  flushSync(() => {
    root.render(element);
  });
  return div.innerHTML;
}
