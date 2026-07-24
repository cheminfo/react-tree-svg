import type { Point } from '../types/Point.ts';

import { refX } from './MarkerDef.utils.tsx';
import { Text } from './Text.tsx';
/**
 * Draw a curved arrow between two points, bending at their midpoint.
 * Relies on a marker with id="arrowhead" being defined in the SVG.
 * @param props - Arrow configuration.
 * @param props.id - Optional id set on the arrow's group.
 * @param props.from - Start point (parent's right anchor).
 * @param props.to - End point (child's left anchor).
 * @param props.label - Text drawn next to the arrow.
 * @param props.horizontalPosition - Where the label sits along the arrow. Defaults to `'center'`.
 * @param props.verticalPosition - Vertical alignment of the label.
 * @returns The arrow group: the path and, when a label is given, its text.
 */

export function Arrow(props: {
  id: string;
  from: Point;
  to: Point;
  label: string;
  horizontalPosition?: 'left' | 'center' | 'right';
  verticalPosition?: 'top' | 'bottom' | 'center';
}) {
  const {
    id,
    from,
    to,
    label,
    horizontalPosition = 'center',
    verticalPosition = 'center',
  } = props;
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

  const headInflectionPoint = {
    x: to.x - refX * 2, // refX attribute of the marker element in the Arrow component shifts the arrow head to the left, and that the vertices of the arrow head are set to refX, which means that the beginning of the arrow head is refX * 2 to the left.
    y: to.y,
  };
  const d = `M ${from.x} ${from.y} C ${middle.x} ${from.y}  ${middle.x} ${to.y}  ${headInflectionPoint.x} ${to.y} Q ${headInflectionPoint.x} ${to.y}  ${to.x} ${to.y} `;

  return (
    <g id={id}>
      <path
        d={d}
        style={{
          fill: 'none',
          strokeWidth: '2',
          stroke: 'black',
          markerEnd: 'url(#arrowhead)',
        }}
      />
      {horizontalPosition === 'center' && (
        <Text
          x={middle.x}
          y={middle.y}
          label={label}
          horizontalPosition={horizontalPosition}
          verticalPosition={verticalPosition}
        />
      )}
      {horizontalPosition === 'right' && (
        <Text
          x={to.x - 12}
          y={to.y - 8}
          label={label}
          horizontalPosition="right"
          verticalPosition={verticalPosition}
        />
      )}
      {horizontalPosition === 'left' && (
        <Text
          x={from.x + 12}
          y={from.y + 8}
          label={label}
          horizontalPosition="left"
          verticalPosition={verticalPosition}
        />
      )}
    </g>
  );
}
