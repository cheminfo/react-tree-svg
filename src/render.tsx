import { getData } from "./data/data";
import { renderToStaticMarkup } from "react-dom/server";
import { SVGBoxesTree } from "./components/SVGBoxesTree";

export function render(tree) {
  const result = renderToStaticMarkup(<SVGBoxesTree data={getData()} />);
  return result;
}
