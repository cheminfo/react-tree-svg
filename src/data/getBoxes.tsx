export function getBoxes(data) {
  const boxes: any[] = [];
  getBoxesSS(data, boxes);
  return boxes;
}

function getBoxesSS(data, boxes) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    boxes.push(
      <g transform={`translate(${datum.position.x} ${datum.position.y})`}>
        {datum.element}
      </g>,
    );

    if (datum.children) {
      getBoxesSS(datum.children, boxes);
    }
  }
}
