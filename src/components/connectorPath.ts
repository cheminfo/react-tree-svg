import type { Point } from '../types/Point.ts';
import type { ConnectorShape } from '../types/drawing.ts';

import { refX } from './MarkerDef.utils.tsx';

/**
 * The path data of a connector between two points.
 * @param from - Start point (the parent's right anchor).
 * @param to - End point (the child's left anchor).
 * @param shape - How the connector runs between them.
 * @param arrowHead - Whether an arrowhead is drawn at `to`: a curve then ends
 * on a short straight segment, so that the head points along the axis.
 * @returns The value of the path's `d` attribute.
 */
export function connectorPath(
  from: Point,
  to: Point,
  shape: ConnectorShape,
  arrowHead: boolean,
): string {
  const middleX = (from.x + to.x) / 2;
  if (shape === 'straight') {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  if (shape === 'elbow') {
    return `M ${from.x} ${from.y} H ${middleX} V ${to.y} H ${to.x}`;
  }
  if (!arrowHead) {
    return `M ${from.x} ${from.y} C ${middleX} ${from.y} ${middleX} ${to.y} ${to.x} ${to.y}`;
  }
  // The marker's refX shifts the head to the left, and its vertices span refX,
  // so the head begins refX * 2 before the end point.
  const headX = to.x - refX * 2;
  return `M ${from.x} ${from.y} C ${middleX} ${from.y}  ${middleX} ${to.y}  ${headX} ${to.y} Q ${headX} ${to.y}  ${to.x} ${to.y} `;
}
