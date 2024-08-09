interface CalculatePositionOptions {
  x?: number;
  y?: number;
  spacingVertical?: number;
  spacingHorizontal?: number;
}

export function calculatePosition(
  data,
  options: CalculatePositionOptions = {},
) {
  const {
    x = 0,
    y = 22,
    spacingVertical = 30,
    spacingHorizontal = 140,
  } = options;
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

interface CalculatePositionMandatoryOptions {
  x: number;
  y: number;
  spacingVertical: number;
  spacingHorizontal: number;
}

function calculateInnerBoxSize(
  data,
  options: CalculatePositionMandatoryOptions,
) {
  for (const datum of data) {
    if (datum.children) {
      calculateInnerBoxSize(datum.children, options);

      datum.childrenBoxSize = {
        width:
          datum.position.width +
          options.spacingHorizontal +
          Math.max(...datum.children.map((d) => d.childrenBoxSize.width)),
        height: Math.max(
          datum.position.height,
          options.spacingVertical * (datum.children.length - 1) +
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

function calculatePositionSS(data, options: CalculatePositionMandatoryOptions) {
  let y = options.y;
  for (const datum of data) {
    if (datum.children) {
      calculatePositionSS(datum.children, {
        ...options,
        x: options.x + datum.position.width + options.spacingHorizontal,
        y,
      });
    }

    datum.position.x = options.x;
    datum.position.y =
      datum.childrenBoxSize.height / 2 - datum.position.height / 2 + y;

    y += datum.childrenBoxSize.height + options.spacingVertical;

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
      datum.childrenBoxSize.height + options.spacingVertical;
  }
}
