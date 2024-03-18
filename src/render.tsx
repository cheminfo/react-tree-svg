import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { SVGBoxesTree } from './components/SVGBoxesTree';

export function render(tree, options) {
  const element = <SVGBoxesTree tree={tree} {...options} />;
  const div = document.createElement('div');
  const root = createRoot(div);
  flushSync(() => {
    root.render(element);
  });
  return div.innerHTML;
}
