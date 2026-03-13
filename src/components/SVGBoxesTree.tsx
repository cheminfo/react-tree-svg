import { calculatePosition } from '../data/calculatePosition.ts';
import { getArrows } from '../data/getArrows.tsx';
import { getBoxes } from '../data/getBoxes.tsx';
import { prepareTree } from '../data/prepareTree.tsx';

import { MarkerDef } from './MarkerDef.tsx';

export function SVGBoxesTree(props) {
  const { tree, ...options } = props;
  const { arrowRendererOptions, nodeRendererOptions, positionOptions } =
    options;

  const data = prepareTree(tree, options);
  calculatePosition(data, positionOptions);
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
