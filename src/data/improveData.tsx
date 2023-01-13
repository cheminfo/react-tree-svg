import OCL from "openchemlib/core";
import { Rectangle } from "../Rectangle";
import { SVG } from "../SVG";

/**
 * Will calculate the SVG of the molecule and the rectangle in which to place the molecule and the corresponding label
 * @param data
 */
export function improveData(data) {
  data = JSON.parse(JSON.stringify(data));
  const options = { level: 0 };
  improveDataSS(data, options);
  return data;
}

function improveDataSS(data, options) {
  for (const datum of data) {
    if (options.level > 0) {
      datum.parent = options.parent;
    }
    datum.position = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    datum.content = getContent(datum);
    if (datum.children) {
      improveDataSS(datum.children, {
        ...options,
        level: options.level + 1,
        parent: datum,
      });
    }
  }
}

function getContent(datum) {
  const molecule = getMolecule(datum);
  const label = getLabel(datum);

  datum.position.width = Math.max(molecule.width, label.width);
  datum.position.height = Math.max(molecule.height, label.height);

  return (
    <g>
      <Rectangle
        width={datum.position.width}
        height={datum.position.height}
        style={{
          ...{ stroke: "black", fill: "white" },
          ...(datum.style || {}),
        }}
      />
      {molecule.content}
    </g>
  );
}

function getLabel(datum) {
  if (!datum.label) {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  return {
    width: 100,
    height: 20,
    content: (
      <text stroke="none" font-size="14" fill="black">
        datum.label
      </text>
    ),
  };
}

function getMolecule(datum): { width: number; height: number; content: any } {
  let molecule;
  if (datum.smiles) {
    molecule = OCL.Molecule.fromSmiles(datum.smiles);
  }

  if (!molecule)
    return {
      width: 0,
      height: 0,
      content: undefined,
    };
  const svg = molecule.toSVG(300, 200, undefined, {
    autoCrop: true,
    autoCropMargin: 30,
  });
  const size = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/
  ).groups;
  return {
    width: size.width,
    height: size.height,
    content: <SVG svg={svg} />,
  };
}
