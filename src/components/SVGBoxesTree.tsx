import { calculatePosition } from '../data/calculatePosition';
import { getArrows } from '../data/getArrows';
import { getBoxes } from '../data/getBoxes';
import { prepareTree } from '../data/prepareTree';

import { MarkerDef } from './MarkerDef';

export function SVGBoxesTree(props) {
  const { tree, ...options } = props;
  const { arrowRendererOptions, nodeRendererOptions } = options;

  const data = prepareTree(tree, options);
  calculatePosition(data, options);
  const boxes = getBoxes(data, nodeRendererOptions);

  const arrows = getArrows(data, arrowRendererOptions);
  const svgSize = {
    width: 0,
    height: 0,
  };
  const width: number[] = [];
  for (const datum of data) {
    width.push(datum.childrenBoxSize.width);
    svgSize.height += datum.childrenBoxSize.height;
  }
  svgSize.width = Math.max(...width);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
    >
      <MarkerDef />
      {boxes}
      {arrows}
    </svg>
  );
}
