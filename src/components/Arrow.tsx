import { CenteredText } from "./CenteredText";
import { Point } from "../types/Point";

/**
 * Creates a simple arrow between 2 points. The arrow has one inflection point, which is the middle of the line.
 * The SVG must define a marker with id="arrowhead" for this to work.
 * @param props
 * @returns
 */

export function Arrow(props: { from: Point; to: Point; label: string }) {
  const { from, to, label } = props;
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const d = `M ${from.x} ${from.y} C ${middle.x} ${from.y}  ${middle.x} ${from.y}  ${middle.x} ${middle.y}   ${middle.x} ${to.y} ${middle.x} ${to.y}  ${to.x} ${to.y}`;
  return (
    <g>
      <path
        d={d}
        style={{
          fill: "none",
          strokeWidth: "2",
          stroke: "black",
          markerEnd: "url(#arrowhead)",
        }}
      />
      <CenteredText x={middle.x} y={middle.y} label={label} />
    </g>
  );
}
