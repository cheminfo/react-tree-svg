import { refX } from './MarkerDef.utils.tsx';

/**
 * Define the arrowhead marker reused as the tip of every connector of a tree.
 * @param props - Marker configuration.
 * @param props.id - Id of the marker, unique on the page: connectors refer to it.
 * @returns SVG `<defs>` holding the arrowhead marker.
 */
export function MarkerDef(props: { id: string }) {
  return (
    <defs>
      <marker
        id={props.id}
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
