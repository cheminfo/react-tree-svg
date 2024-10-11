import { Arrow } from '../components/Arrow';

export function getArrows(nodes, options = {}) {
  const status = { level: 0 };
  const arrows = [];
  getArrowsSS(nodes, arrows, status, options);
  return arrows;
}

function getArrowsSS(nodes, arrows, status, options: any = {}) {
  const { getLabel, horizontalPosition, getID, verticalPosition } = options;

  for (const node of nodes) {
    if (node.children) {
      for (const child of node.children) {
        arrows.push(
          <Arrow
            id={getID ? getID(node) : undefined}
            key={arrows.length}
            from={node.anchor.right}
            to={child.anchor.left}
            label={getLabel?.(child)}
            horizontalPosition={horizontalPosition}
            verticalPosition={verticalPosition}
          />,
        );
      }

      getArrowsSS(
        node.children,
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
