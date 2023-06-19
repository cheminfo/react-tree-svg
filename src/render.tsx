import { renderToStaticMarkup } from "react-dom/server";
import { SVGBoxesTree } from "./components/SVGBoxesTree";
import { prepareData } from "./data/prepareData";

export function render(data, options) {
  data = prepareData(data, options);

  const result = renderToStaticMarkup(<SVGBoxesTree data={data} />);
  return result;
}
