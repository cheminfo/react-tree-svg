import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { SVGBoxesTree } from './components/SVGBoxesTree.tsx';

/**
 * Render a tree to a standalone SVG markup string. `flushSync` forces a
 * synchronous render so the markup is ready right away, which is what makes
 * server-side SVG generation possible.
 * @param tree - Root nodes of the tree to draw.
 * @param options - Node renderer and layout options forwarded to the tree.
 * @returns The SVG document as an HTML string.
 */
export function render(tree, options) {
  const element = <SVGBoxesTree tree={tree} {...options} />;
  const div = document.createElement('div');
  const root = createRoot(div);
  flushSync(() => {
    root.render(element);
  });
  return div.innerHTML;
}
