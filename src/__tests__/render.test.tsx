import OCL from "openchemlib/core";

import { render } from "..";
import { getData } from "../data/demo/molecules";
import { getDataTaxonomy } from "../data/demo/taxonomies";

test("render: Molecule", () => {
  const data = getData();
  const svg = render(data, {
    nodeRenderer: "molecule",
    nodeRendererOptions: { OCL },
    positionOptions: {
      spacingHorizontal: 150,
    },
  });
  const match = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/
  );
  const size = match?.groups;
  expect(Number(size?.width)).toBe(174);
  expect(Number(size?.height)).toBe(156);
});
