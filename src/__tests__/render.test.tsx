import OCL from "openchemlib/core";

import { render } from "..";
import { getData } from "../data/demo/molecules";
import { getDataTaxonomy } from "../data/demo/taxonomies";
import { taxonomyRender } from "../nodeRenderer/taxonomyRender";
import { moleculeRenderer } from "../nodeRenderer/moleculeRenderer";
import { prepareData } from "../data/prepareData";

test("render", () => {
  const data = getData();
  console.log(data);
  const svg = render(data, {
    nodeRenderer: moleculeRenderer,
    nodeRendererOptions: { OCL },
    positionOptions: {
      spacingHorizontal: 150,
    },
  });
});
