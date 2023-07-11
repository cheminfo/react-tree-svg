export function calculatePosition(data, options) {
  const {
    x = 0,
    y = 22,
    spacingVertical = 30,
    spacingHorizontal = 140,
  } = options?.positionOptions || {};
  calculateInnerBoxSize(data, {
    x,
    y,
    spacingVertical,
    spacingHorizontal,
  });
  calculatePositionSS(data, {
    x,
    y,
    spacingVertical,
    spacingHorizontal,
  });
}

function calculateInnerBoxSize(data, status) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum.children) {
      calculateInnerBoxSize(datum.children, status);

      datum.childrenBoxSize = {
        width:
          datum.position.width +
          status.spacingHorizontal +
          Math.max(...datum.children.map((d) => d.childrenBoxSize.width)),
        height: Math.max(
          datum.position.height,
          status.spacingVertical * (datum.children.length - 1) +
            datum.children
              .map((d) => d.childrenBoxSize.height)
              .reduce((a, b) => a + b, 0),
        ),
      };
    } else {
      datum.childrenBoxSize = {
        width: datum.position.width,
        height: datum.position.height,
      };
    }
  }
}

function calculatePositionSS(data, status) {
  let y = status.y;
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum.children) {
      calculatePositionSS(datum.children, {
        ...status,
        x: status.x + datum.position.width + status.spacingHorizontal,
        y: y,
      });
    }

    datum.position.x = status.x;
    datum.position.y =
      datum.childrenBoxSize.height / 2 - datum.position.height / 2 + y;

    y += datum.childrenBoxSize.height + status.spacingVertical;

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
    datum.childrenBoxSize.height =
      datum.childrenBoxSize.height + status.spacingVertical;
  }
}
