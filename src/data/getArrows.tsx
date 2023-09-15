import { Arrow } from '../components/Arrow';

export function getArrows(nodes, options = {}) {
  const status = { level: 0 };
  const arrows = [];
  getArrowsSS(nodes, arrows, status, options);
  return arrows;
}

function getArrowsSS(nodes, arrows, status, options: any = {}) {
  const { getLabel, labelPosition } = options;

  for (const node of nodes) {
    if (node.children) {
      for (const child of node.children) {
        arrows.push(
          <Arrow
            key={arrows.length}
            from={node.anchor.right}
            to={child.anchor.left}
            label={getLabel?.(child)}
            labelPosition={labelPosition}
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
