import { SVGBoxesTaxonomiesTree } from "./components/SVGBoxesTaxonomiesTree";
import { SVGBoxesTree } from "./components/SVGBoxesTree";
import { getDataTaxonomy } from "./data/demo/taxonomies";
import { prepareDataTaxonomy } from "./data/prepareDataTaxonomy";
import { taxonomyRender } from "./nodeRenderer/taxonomyRender";
import { prepareData } from "./data/prepareData";
import { moleculeRenderer } from "./nodeRenderer/moleculeRenderer";
import OCL from "openchemlib/core";
import { getData } from "./data/demo/molecules";

const dataTaxonomy = prepareDataTaxonomy(getDataTaxonomy(), {
  nodeRenderer: taxonomyRender,
});
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
      <SVGBoxesTaxonomiesTree data={dataTaxonomy} />
      <SVGBoxesTree data={data} />
    </div>
  );
}

export default App;
