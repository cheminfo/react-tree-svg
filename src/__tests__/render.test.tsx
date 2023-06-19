import { render } from "..";

test("render", () => {
  const data = [
    {
      value: "10",
      children: [
        {
          value: "20",
        },
      ],
    },
  ];

  const svg = render(data, {
    nodeRenderer,
    nodeRendererOptions: { width: 100, height: 50 },
  });
  console.log(svg);
});

function nodeRenderer(datum, options) {
  return {
    component: <text>{datum.value}</text>,
    width: options.width,
    height: options.height,
  };
}
