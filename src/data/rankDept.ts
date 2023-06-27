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
  for (let datum of data) {
    if (taxonomiesRanks[datum.rank] >= maxRankDepth) {
      delete datum.children;
    }
    if (datum.children) {
      rankDept(datum.children, maxRankDepth);
    }
  }
}
