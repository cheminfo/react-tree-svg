import { refX } from './MarkerDef.utils';

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
