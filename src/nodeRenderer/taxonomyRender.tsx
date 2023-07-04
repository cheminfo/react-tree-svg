import { Rectangle } from "../components/Rectangle";

export function taxonomyRender(
  datum,
  nodeRendererOptions = {}
): {
  width: number;
  height: number;
  component: any;
} {
  if (Object.keys(nodeRendererOptions).length !== 0) {
    throw new Error("This should never happen");
  }
  const minSize = { width: 120, height: 20 };
  const taxonomy = getTaxonomy(datum, minSize);
  const label = getLabel(datum, minSize);

  const width = Math.max(taxonomy.width, label.width);
  const height = Math.max(taxonomy.height, label.height);
  const nbTaxonomies = getNbTaxonomies(datum, width, minSize);
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
function getNbTaxonomies(datum, width, minSize) {
  return {
    width: minSize.width,
    height: minSize.height,
    content: (
      <text
        x={width}
        y={-5}
        textAnchor="end"
        stroke="none"
        font-size="14"
        fill="#00008B" // dark blue
        fontStyle={"bold"}
        font-family="Arial, Helvetica, sans-serif"
      >
        {datum.nbTaxonomies}
      </text>
    ),
  };
}

function getLabel(
  datum,
  minSize,
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
    width: minSize.width,
    height: minSize.height,
    content: (
      <text
        x={spacingHorizontal / 2}
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
  minSize,
  options: { spacingHorizontal?: number; fontSize?: number } = {}
) {
  const { font, fontSize, spacingHorizontal } = {
    font: "Arial, Helvetica, sans-serif",
    fontSize: 16,
    spacingHorizontal: 8,
    ...options,
  };
  if (datum.name === "") {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }

  let { width, height } = getStringSize(datum.name, {
    font,
    fontSize,
    spacingHorizontal,
  });
  let textWith = width;
  let positionX = spacingHorizontal / 2;
  if (height <= minSize.height) {
    height = minSize.height;
  }
  if (width <= minSize.width) {
    width = minSize.width;
    positionX = (width - textWith + spacingHorizontal) / 2;
  }

  return {
    width: width,
    height: height,

    content: (
      <svg height={height} width={width} dominant-baseline="central">
        <text
          x={positionX}
          y={height / 2}
          stroke="none"
          fontSize={fontSize}
          fill="black"
          font-family={font}
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
  const {
    font = "Arial, Helvetica, sans-serif",
    fontSize = 16,
    spacingHorizontal = 8,
  } = options;
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
