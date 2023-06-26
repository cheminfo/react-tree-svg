import { SVGBoxesTaxonomiesTree } from "./taxonomiesTree/SVGBoxesTaxonomiesTree";
import { SVGBoxesTree } from "./components/SVGBoxesTree";
import { getDataTaxonomy } from "./data/demo/taxonomies";
import { prepareDataTaxonomy } from "./taxonomiesTree/prepareDataTaxonomy";
import { taxonomyRender } from "./taxonomiesTree/taxonomyRender";
import { prepareData } from "./data/prepareData";
import { moleculeRenderer } from "./nodeRenderer/moleculeRenderer";
import OCL from "openchemlib/core";
import { getData } from "./data/demo/molecules";

const dataTaxonomy = prepareDataTaxonomy(getDataTaxonomy(), {
  nodeRenderer: taxonomyRender,
  maxRankDepth: 7,
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
    </div>
  );
}

export default App;
