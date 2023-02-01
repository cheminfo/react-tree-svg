import { MarkerDef } from "./MarkerDef";
import { getBoxes } from "../data/getBoxes";
import { getArrows } from "../data/getArrows";

export function SVGBoxesTree(props) {
  const boxes = getBoxes(props.data);
  const arrows = getArrows(props.data, {
    getLabel: (node) => {
      console.log(node);
      return node?.reaction?.Label;
    },
    labelPosition: "center",
  });

  const svgSize = {
    width: props.data[0].childrenBoxSize.width,
    height: props.data[0].childrenBoxSize.height,
  };

  console.log(svgSize);

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
