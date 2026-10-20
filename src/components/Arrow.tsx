import type { CSSProperties } from 'react';

import type { Point } from '../types/Point.ts';
import type { ConnectorShape } from '../types/drawing.ts';

import { Text } from './Text.tsx';
import { connectorPath } from './connectorPath.ts';

interface ArrowProps {
  /** Id set on the arrow's group. */
  id?: string;
  /** Start point (the parent's right anchor). */
  from: Point;
  /** End point (the child's left anchor). */
  to: Point;
  /** Text drawn next to the arrow; it may hold newlines. */
  label?: string;
  /**
   * Where the label sits along the arrow.
   * @default 'center'
   */
  horizontalPosition?: 'left' | 'center' | 'right';
  /**
   * Vertical alignment of the label.
   * @default 'center'
   */
  verticalPosition?: 'top' | 'bottom' | 'center';
  /**
   * Id of the marker drawn as the arrowhead.
   * @default undefined — no arrowhead
   */
  markerId?: string;
  /**
   * How the arrow runs between its points.
   * @default 'curve'
   */
  shape?: ConnectorShape;
  /** Class of the path. */
  className?: string;
  /** Inline style of the path, over its presentation attributes. */
  style?: CSSProperties;
}

/**
 * Draw an arrow between two points, with an optional label. The default look
 * is written as presentation attributes, so a CSS class overrides it.
 * @param props - Arrow configuration.
 * @returns The arrow group: the path and, when a label is given, its text.
 */
export function Arrow(props: ArrowProps) {
  const {
    id,
    from,
    to,
    label = '',
    horizontalPosition = 'center',
    verticalPosition = 'center',
    markerId,
    shape = 'curve',
    className,
    style,
  } = props;
  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const d = connectorPath(from, to, shape, markerId !== undefined);

  return (
    <g id={id}>
      <path
        d={d}
        className={className}
        fill="none"
        strokeWidth={2}
        stroke="black"
        markerEnd={markerId === undefined ? undefined : `url(#${markerId})`}
        style={style}
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
