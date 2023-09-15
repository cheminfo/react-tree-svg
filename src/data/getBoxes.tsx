export function getBoxes(nodes) {
  const boxes: any[] = [];
  appendBoxes(nodes, boxes);
  return boxes;
}

function appendBoxes(nodes, boxes) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    boxes.push(
      <g key={i} transform={`translate(${node.position.x} ${node.position.y})`}>
        {node.element}
      </g>,
    );

    if (node.children) {
      appendBoxes(node.children, boxes);
    }
  }
}
