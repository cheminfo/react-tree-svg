import { getData } from "./data/data";
import { renderToStaticMarkup } from "react-dom/server";
import { MoleculesGraph } from "./components/MoleculesGraph";

export function render() {
  const result = renderToStaticMarkup(<MoleculesGraph data={getData()} />);
  return result;
}
