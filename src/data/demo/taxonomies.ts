const taxonomies = [
  {
    name: "",
    rank: "superkingdom",
    count: 1,
    children: [
      {
        name: "",
        rank: "kingdom",
        count: 1,
        children: [
          {
            name: "",
            rank: "phylum",
            count: 1,
            children: [
              {
                name: "",
                rank: "class",
                count: 1,
                children: [
                  {
                    name: "",
                    rank: "order",
                    count: 1,
                    children: [
                      {
                        name: "",
                        rank: "family",
                        count: 1,
                        children: [
                          {
                            name: "",
                            rank: "genus",
                            count: 1,
                            children: [
                              {
                                name: "plants",
                                rank: "species",
                                count: 1,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Bacteria",
    rank: "superkingdom",
    count: 1,
    children: [
      {
        name: "",
        rank: "kingdom",
        count: 1,
        children: [
          {
            name: "Bacillota",
            rank: "phylum",
            count: 1,
            children: [
              {
                name: "Bacilli",
                rank: "class",
                count: 1,
                children: [
                  {
                    name: "Bacillales",
                    rank: "order",
                    count: 1,
                    children: [
                      {
                        name: "Bacillaceae",
                        rank: "family",
                        count: 1,
                        children: [
                          {
                            name: "Bacillus",
                            rank: "genus",
                            count: 1,
                            children: [
                              {
                                name: "Bacillus subtilis",
                                rank: "species",
                                count: 1,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Eukaryota",
    rank: "superkingdom",
    count: 3,
    children: [
      {
        name: "Viridiplantae",
        rank: "kingdom",
        count: 3,
        children: [
          {
            name: "Streptophyta",
            rank: "phylum",
            count: 3,
            children: [
              {
                name: "Magnoliopsida",
                rank: "class",
                count: 3,
                children: [
                  {
                    name: "Asterales",
                    rank: "order",
                    count: 2,
                    children: [
                      {
                        name: "Asteraceae",
                        rank: "family",
                        count: 2,
                        children: [
                          {
                            name: "Aster",
                            rank: "genus",
                            count: 1,
                            children: [
                              {
                                name: "Aster altaicus",
                                rank: "species",
                                count: 1,
                              },
                            ],
                          },
                          {
                            name: "Heteropappus",
                            rank: "genus",
                            count: 1,
                            children: [
                              {
                                name: "Heteropappus altaicus",
                                rank: "species",
                                count: 1,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: "Fabales",
                    rank: "order",
                    count: 1,
                    children: [
                      {
                        name: "Fabaceae",
                        rank: "family",
                        count: 1,
                        children: [
                          {
                            name: "Cassia",
                            rank: "genus",
                            count: 1,
                            children: [
                              {
                                name: "Cassia roxburghii",
                                rank: "species",
                                count: 1,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getDataTaxonomy() {
  return taxonomies;
}
