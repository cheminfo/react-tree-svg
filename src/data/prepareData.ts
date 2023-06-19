import { calculatePosition } from "./calculatePosition";
import { improveData } from "./improveData";

export function prepareData(data, options) {
  data = improveData(data, options);
  calculatePosition(data);
  return data;
}
