import { Arrow } from "../Arrow";

export function getArrows(data) {
  const status = { level: 0 };
  const arrows = [];
  getArrowsSS(data, arrows, status);
  return arrows;
}

function getArrowsSS(data, arrows, status) {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum.children) {
      for (const child of datum.children) {
        arrows.push(<Arrow from={datum.anchor.right} to={child.anchor.left} />);
      }

      getArrowsSS(datum.children, arrows, {
        ...status,
        level: status.level + 1,
      });
    }
  }
}
