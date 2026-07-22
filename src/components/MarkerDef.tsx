import { refX } from './MarkerDef.utils.tsx';

/**
 * Define the shared "arrowhead" marker reused as the tip of every connector arrow.
 * @returns SVG `<defs>` holding the arrowhead marker.
 */
export function MarkerDef() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX={refX}
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" />
      </marker>
    </defs>
  );
}
