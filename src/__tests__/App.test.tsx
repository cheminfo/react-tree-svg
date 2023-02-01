import { getData } from "../data/data";
import { renderToStaticMarkup } from "react-dom/server";
import { SVGBoxesTree } from "../components/SVGBoxesTree";

test("", () => {
  const result = renderToStaticMarkup(<SVGBoxesTree data={getData()} />);
  console.log(result);
});
