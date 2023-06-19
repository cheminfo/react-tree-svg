import { SVGBoxesTree } from "./components/SVGBoxesTree";

import { getData } from "./data/demo/molecules";
import { prepareData } from "./data/prepareData";
import { moleculeRenderer } from "./nodeRenderer/moleculeRenderer";
import OCL from "openchemlib/core";

const data = prepareData(getData(), {
  nodeRenderer: moleculeRenderer,
  nodeRendererOptions: { OCL },
});

function App() {
  return (
    <div
      style={{
        border: "1px solid red",
        overflow: "clip",
      }}
    >
      <SVGBoxesTree data={data} />
    </div>
  );
}

export default App;
