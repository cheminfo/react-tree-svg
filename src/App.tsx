import { SVGBoxesTree } from "./components/SVGBoxesTree";
import { getDataTaxonomy } from "./data/demo/taxonomies";
import { taxonomyRender } from "./nodeRenderer/taxonomyRender";
import { prepareData } from "./data/prepareData";
import { moleculeRenderer } from "./nodeRenderer/moleculeRenderer";
import OCL from "openchemlib/core";
import { getData } from "./data/demo/molecules";

const dataTaxonomy = prepareData(getDataTaxonomy(), {
  nodeRenderer: taxonomyRender,
  rankDepthOptions: {
    maxRankDepth: 8,
  },
  positionOptions: {
    spacingHorizontal: 100,
  },
});
const data = prepareData(getData(), {
  nodeRenderer: moleculeRenderer,
  nodeRendererOptions: { OCL },
  positionOptions: {
    spacingHorizontal: 150,
  },
});

function App() {
  return (
    <div
      style={{
        border: "1px solid red",
        overflow: "clip",
      }}
    >
      <SVGBoxesTree data={dataTaxonomy} />
      <SVGBoxesTree data={data} />
    </div>
  );
}

export default App;
