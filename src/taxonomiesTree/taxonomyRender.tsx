import { Rectangle } from "../components/Rectangle";

export function taxonomyRender(datum): {
  width: number;
  height: number;
  component: any;
} {
  const taxonomy = getTaxonomy(datum);
  const label = getLabel(datum);

  const width = Math.max(taxonomy.width, label.width);
  const height = Math.max(taxonomy.height, label.height);
  const nbTaxonomies = getNbTaxonomies(datum, width);
  console.log({ label });
  return {
    width,
    height,
    component: (
      <g>
        <Rectangle
          width={width}
          height={height}
          style={{
            ...{ stroke: "black", fill: "white" },
            ...(datum.style || {}),
          }}
        />
        {label.content}
        {taxonomy.content}
        {nbTaxonomies.content}
      </g>
    ),
  };
}
function getNbTaxonomies(datum, width) {
  return {
    width: 150,
    height: 20,
    content: (
      <text
        x={width}
        y={-5}
        textAnchor="end"
        stroke="none"
        font-size="14"
        fill="blue"
        fontStyle={"bold"}
      >
        {datum.nbTaxonomies}
      </text>
    ),
  };
}

function getLabel(
  datum,
  options: { spacingHorizontal?: number; fontSize?: number } = {}
) {
  const { spacingHorizontal } = {
    spacingHorizontal: 8,

    ...options,
  };
  if (datum.rank === "") {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  return {
    width: 150,
    height: 20,
    content: (
      <text
        x={spacingHorizontal}
        y={-6}
        textAnchor="start"
        stroke="none"
        font-size="14"
        fill="grey"
        fontStyle={"italic"}
        font-family="Arial, Helvetica, sans-serif"
      >
        {datum.rank}
      </text>
    ),
  };
}

function getTaxonomy(
  datum,
  options: { spacingHorizontal?: number; fontSize?: number } = {}
) {
  const { spacingHorizontal, fontSize } = {
    spacingHorizontal: 8,
    fontSize: 20,
    ...options,
  };
  if (datum.name === "") {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }

  let { width, height } = getStringSize(datum.name, options);

  return {
    width: width,
    height: height,

    content: (
      <svg height={height} width={width} dominant-baseline="central">
        <text
          x={spacingHorizontal / 2}
          y={height / 2}
          stroke="none"
          fontSize={fontSize}
          fill="black"
          font-family="Arial, Helvetica, sans-serif"
        >
          {datum.name}
        </text>
      </svg>
    ),
  };
}

function getStringSize(
  text: string,
  options: { font?: string; fontSize?: number; spacingHorizontal?: number }
): { width: number; height: number } {
  const { font, fontSize, spacingHorizontal } = {
    font: "Arial",
    fontSize: 20,
    spacingHorizontal: 8,
    ...options,
  };
  const tempElement = document.createElement("span");
  tempElement.style.font = `${fontSize}px ${font}`;
  tempElement.style.visibility = "hidden";
  tempElement.style.position = "absolute";
  tempElement.style.top = "-9999px";
  tempElement.style.left = "-9999px";
  tempElement.textContent = text;

  document.body.appendChild(tempElement);

  let { height, width } = tempElement.getBoundingClientRect();

  document.body.removeChild(tempElement);

  return { width: width + spacingHorizontal, height };
}
