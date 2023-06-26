import { calculatePositionTaxonomies } from "./calculatePositionTaxonomies";
import { improveDataTaxonomies } from "./improveDataTaxonomies";

export function prepareDataTaxonomy(data, options) {
  data = improveDataTaxonomies(data, options);
  calculatePositionTaxonomies(data);
  return data;
}
