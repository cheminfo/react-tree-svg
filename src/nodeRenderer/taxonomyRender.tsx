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
        {taxonomy.content}
        {label.content}
      </g>
    ),
  };
}

function getLabel(datum) {
  if (datum.rank === "") {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  return {
    width: 200,
    height: 20,
    content: (
      <text
        x={0}
        y={-6}
        textAnchor="start"
        stroke="none"
        font-size="20"
        fill="black"
      >
        {datum.rank}
      </text>
    ),
  };
}

function getTaxonomy(datum) {
  if (datum.name === "") {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  const { width, height } = getStringSize(datum.name, "Arial", 20, 5);
  return {
    width: width / 2,
    height: height / 2,
    content: (
      <svg height={height} width={width}>
        <text x="10" y="23" stroke="none" fontSize="20" fill="black">
          {datum.name}
        </text>
      </svg>
    ),
  };
}

function getStringSize(
  text: string,
  font: string,
  fontSize: number,
  padding: number
): { width: number; height: number } {
  const textWidth = text.length * fontSize;
  const svgWidth = textWidth + padding * 2;
  const svgHeight = fontSize * 1.5 + padding * 2;

  const tempElement = document.createElement("span");
  tempElement.style.font = `${fontSize}px ${font}`;
  tempElement.style.visibility = "hidden";
  tempElement.style.position = "absolute";
  tempElement.style.top = "-9999px";
  tempElement.style.left = "-9999px";
  tempElement.textContent = text;

  document.body.appendChild(tempElement);

  const { height } = tempElement.getBoundingClientRect();

  document.body.removeChild(tempElement);

  return { width: svgWidth, height: svgHeight + height + padding };
}
