import { MarkerDef } from "./MarkerDef";
import { getBoxes } from "../data/getBoxes";
import { getArrows } from "../data/getArrows";

export function MoleculesGraph(props) {
  const boxes = getBoxes(props.data);
  const arrows = getArrows(props.data);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: "0",
        left: "0",
      }}
    >
      <MarkerDef />
      {boxes}
      {arrows}
    </svg>
  );

  return svg;
}
