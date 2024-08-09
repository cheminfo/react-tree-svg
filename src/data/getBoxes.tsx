export function getBoxes(nodes, options) {
  const boxes: any[] = [];
  appendBoxes(nodes, boxes, options);
  return boxes;
}

function appendBoxes(nodes, boxes, options: any = {}) {
  const { getID } = options;
  for (const node of nodes) {
    boxes.push(
      <g
        id={getID ? getID(node) : undefined}
        key={boxes.length}
        transform={`translate(${node.position.x} ${node.position.y})`}
      >
        {node.element}
      </g>,
    );

    if (node.children) {
      appendBoxes(node.children, boxes, options);
    }
  }
}
