export function getBoxes(nodes) {
  const boxes: any[] = [];
  appendBoxes(nodes, boxes);
  return boxes;
}

function appendBoxes(nodes, boxes) {
  for (const node of nodes) {
    boxes.push(
      <g
        key={boxes.length}
        transform={`translate(${node.position.x} ${node.position.y})`}
      >
        {node.element}
      </g>,
    );

    if (node.children) {
      appendBoxes(node.children, boxes);
    }
  }
}
