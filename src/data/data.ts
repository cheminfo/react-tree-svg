import OCL from "openchemlib/core";
import { improveData } from "./improveData";

export const example = [
  {
    smiles: "CCCC",
    style: {},
    children: [
      {
        smiles: "COCC",
        label: "123.12",
        style: {
          fillOpacity: 0.5,
          fill: "red",
        },
      },
      {
        smiles: "C(=O)CC",
        label: "123.12",
        style: {
          fillOpacity: 0.5,
          fill: "red",
        },
      },
    ],
  },
];

export function getData(data = example) {
  improveData(data);
  return data;
}

export function getArrows(data) {
  const results = [];
  const status = { from: { x: 300, y: 150 } };
  getArrowsSS(data, results, status);
  return results;
}

function getArrowsSS(data, results, status) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];

    if (datum.children) {
      getArrowsSS(datum.children, results, {
        ...status,
        level: status.level + 1,
      });
    }
  }
}

export function getStructures(data) {
  const results = [];
  const status = { level: 0 };
  getStructuresSS(data, results, status);
  return results;
}

function getStructuresSS(data, results, status) {
  let molecule;
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum.smiles) {
      molecule = OCL.Molecule.fromSmiles(datum.smiles);
    }

    if (molecule) {
      const svg = molecule.toSVG(300, 200, undefined, { autoCrop: true });
      const size = svg.match(
        /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/
      ).groups;
      console.log(size);
      results.push({
        svg,
        width: size.width,
        height: size.height,
        x: status.level * 300,
        y: i * 300,
        style: { fill: "red", fillOpacity: 0.5 },
      });
    }

    if (datum.children) {
      getStructuresSS(datum.children, results, {
        ...status,
        level: status.level + 1,
      });
    }
  }
}
