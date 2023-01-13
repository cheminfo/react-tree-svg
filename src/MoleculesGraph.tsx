import { Arrow } from "./Arrow";
import { MarkerDef } from "./MarkerDef";
import { getStructures, getArrows } from "./data/data";

export function MoleculesGraph(props) {
  const structures = getStructures(props.data).map((structure) => {
    return (
      <g
        key={Math.random()}
        transform={"translate(" + structure.x + " " + structure.y + ")"}
      >
        <rect
          style={structure.style}
          height={structure.height}
          width={structure.width}
        />
        <g
          dangerouslySetInnerHTML={{
            __html: structure.svg,
          }}
        />
      </g>
    );
  });

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
      {structures}
      <Arrow from={{ x: 20, y: 20 }} to={{ x: 200, y: 200 }} />
    </svg>
  );

  return svg;
}
