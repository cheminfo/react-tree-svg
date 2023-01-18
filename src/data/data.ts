import { improveData } from "./improveData";
import { calculatePosition } from "./calculatePosition";

export const example = [
  {
    smiles: "CN1[C@H]2CC[C@@H]1[C@@H](C(OC)=O)[C@@H](OC(C3=CC=CC=C3)=O)C2",
    children: [
      {
        smiles: "COCC",
        transformation: "Ether",
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
            transformation: "Elimination",
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
      {
        smiles: "C(=O)CC",
        label: "123.12",
        style: {
          fillOpacity: 0.5,
          fill: "red",
        },
        children: [
          {
            idCode: "fjuQP@JV@bVRiLmkMr{pTmUTpTDLHqEP@",
            label: "123.12",
            transformation: "Elimination",
            style: {
              fillOpacity: 0.2,
              fill: "red",
            },
          },
          {
            idCode: "fdeQ@@DXAdTTtTTRbqUXp_QZh@``A@@@",
            label: "123.12",
            style: {
              fillOpacity: 0.5,
              fill: "red",
            },
          },
          {
            idCode: "dcLF@@siWTify^ajjjjIHRiB`@",
            label: "123.12",
            style: {
              fillOpacity: 0.5,
              fill: "red",
            },
          },
          {
            idCode: "fmaP@N`QrH|bbtTRTrTTRRqbeiQoYRVoVhHHjjjjZJZbdZVgee@@",
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
