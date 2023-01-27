import { getData } from "../data/data";
import { renderToStaticMarkup } from "react-dom/server";
import { MoleculesGraph } from "../components/MoleculesGraph";

test("", () => {
  const result = renderToStaticMarkup(<MoleculesGraph data={getData()} />);
  console.log(result);
});
