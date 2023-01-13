export function calculatePosition(data) {
  const status = { level: 0 };
  calculatePositionSS(data, status);
}

function calculatePositionSS(data, status) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    datum.level = status.level;
    datum.position.x = datum.level * 300;
    datum.position.y = i * 200;

    datum.anchor = {
      left: {
        x: datum.position.x,
        y: datum.position.y + datum.position.height / 2,
      },
      right: {
        x: datum.position.x + datum.position.width,
        y: datum.position.y + datum.position.height / 2,
      },
    };

    if (datum.children) {
      calculatePositionSS(datum.children, {
        ...status,
        level: status.level + 1,
      });
    }
  }
}
