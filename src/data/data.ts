import { improveData } from "./improveData";
import { calculatePosition } from "./calculatePosition";

export const example = [
  {
    smiles: "CCCC",
    children: [
      {
        smiles: "COCC",
        label: "123.12",
        style: {
          fillOpacity: 0.2,
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
        children: [
          {
            smiles: "COC",
            label: "123.12",
            style: {
              fillOpacity: 0.2,
              fill: "red",
            },
          },
          {
            smiles: "C(=O)C",
            label: "123.12",
            style: {
              fillOpacity: 0.5,
              fill: "red",
            },
          },
          {
            smiles: "CC",
            label: "123.12",
            style: {
              fillOpacity: 0.5,
              fill: "red",
            },
          },
        ],
      },
    ],
  },
];

export function getData(data = example) {
  data = improveData(data);
  calculatePosition(data);
  return data;
}
