export function getBoxes(data) {
  const boxes: any[] = [];
  const status = { level: 0 };
  getBoxesSS(data, boxes, status);
  return boxes;
}

function getBoxesSS(data, boxes, status) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    boxes.push(
      <g
        transform={
          "translate(" + datum.position.x + " " + datum.position.y + ")"
        }
      >
        {datum.content}
      </g>
    );

    if (datum.children) {
      getBoxesSS(datum.children, boxes, {
        ...status,
        level: status.level + 1,
      });
    }
  }
}
