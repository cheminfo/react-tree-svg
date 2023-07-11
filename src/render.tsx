import { renderToStaticMarkup } from 'react-dom/server';
import { SVGBoxesTree } from './components/SVGBoxesTree';
import { prepareData } from './data/prepareData';
import { taxonomyRender } from './nodeRenderer/taxonomyRender';
import { moleculeRenderer } from './nodeRenderer/moleculeRenderer';
import OCL from 'openchemlib/core';
export function render(data, options) {
  if (options.nodeRenderer === 'taxonomy') {
    options.nodeRenderer = taxonomyRender;
  } else if (options.nodeRenderer === 'molecule') {
    options.nodeRenderer = moleculeRenderer;
    options.nodeRendererOptions = { OCL };
  }
  data = prepareData(data, options);
  const result = renderToStaticMarkup(<SVGBoxesTree data={data} />);
  return result;
}
