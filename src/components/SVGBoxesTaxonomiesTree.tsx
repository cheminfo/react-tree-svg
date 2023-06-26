import { MarkerDef } from "./MarkerDef";
import { getBoxes } from "../data/getBoxes";
import { getArrows } from "../data/getArrows";

export function SVGBoxesTaxonomiesTree(props) {
  const boxes = getBoxes(props.data);
  const arrows = getArrows(props.data, {
    getLabel: (node) => {
      console.log(node);
      return node?.reaction?.Label;
    },
    labelPosition: "center",
  });
  let svgSize = {
    width: 0,
    height: 0,
  };
  let width: number[] = [];
  for (const datum of props.data) {
    width.push(datum.childrenBoxSize.width);
    svgSize.height += datum.childrenBoxSize.height;
  }
  svgSize.width = Math.max(...width);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={"0 0 " + svgSize.width + " " + svgSize.height}
    >
      <MarkerDef />
      {boxes}
      {arrows}
    </svg>
  );

  return svg;
}
