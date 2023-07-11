import { Arrow } from '../components/Arrow';

export function getArrows(data, options = {}) {
  const status = { level: 0 };
  const arrows = [];
  getArrowsSS(data, arrows, status, options);
  return arrows;
}

function getArrowsSS(data, arrows, status, options: any = {}) {
  const { getLabel, labelPosition } = options;

  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum.children) {
      for (const child of datum.children) {
        arrows.push(
          <Arrow
            from={datum.anchor.right}
            to={child.anchor.left}
            label={getLabel && getLabel(child)}
            labelPosition={labelPosition}
          />,
        );
      }

      getArrowsSS(
        datum.children,
        arrows,
        {
          ...status,
          level: status.level + 1,
        },
        options,
      );
    }
  }
}
