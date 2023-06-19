const molecules = [
  {
    smiles: "CN1[C@H]2CC[C@@H]1[C@@H](C(OC)=O)[C@@H](OC(C3=CC=CC=C3)=O)C2",
    children: [
      {
        smiles: "CCCCCOCCCCCC",
        transformation: "Ether",
        label: "123.12",
        style: {
          fillOpacity: 0.2,
          fill: "red",
        },
      },
      {
        smiles: "CCCCCCCC(=O)CC",
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
            children: [
              {
                smiles: "COCCCCCC",
                label: "123.12",
                transformation: "Elimination",
                style: {
                  fillOpacity: 0.2,
                  fill: "red",
                },
              },
            ],
          },
          {
            smiles: "C(=O)C",
            label: "123.12",
            style: {
              fillOpacity: 0.5,
              fill: "red",
            },
            children: [
              {
                smiles: "COCCCCCC",
                label: "123.12",
                transformation: "Elimination",
                style: {
                  fillOpacity: 0.2,
                  fill: "red",
                },
              },
              {
                smiles: "COCCCC",
                label: "123.12",
                transformation: "Elimination",
                style: {
                  fillOpacity: 0.2,
                  fill: "red",
                },
              },
              {
                smiles: "COCC",
                label: "123.12",
                transformation: "Elimination",
                style: {
                  fillOpacity: 0.2,
                  fill: "red",
                },
              },
            ],
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

export function getData() {
  return molecules;
}
