import { renderToStaticMarkup } from 'react-dom/server';

import { SVGBoxesTree } from './components/SVGBoxesTree';

export function render(tree, options) {
  const result = renderToStaticMarkup(
    <SVGBoxesTree tree={tree} {...options} />,
  );
  return result;
}
