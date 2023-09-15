const taxonomiesRanks = {
  superkingdom: 1,
  kingdom: 2,
  phylum: 3,
  class: 4,
  order: 5,
  family: 6,
  genus: 7,
  species: 8,
};
export function rankDept(data, maxRankDepth) {
  for (const node of data) {
    if (taxonomiesRanks[node.rank] >= maxRankDepth) {
      delete node.children;
    }
    if (node.children) {
      rankDept(node.children, maxRankDepth);
    }
  }
}
