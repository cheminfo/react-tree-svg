export function RightText(props: { x: number; y: number; label: string }) {
  const { x, y, label } = props;
  const labelPosition = 'translate(' + x + ',' + y + ')';
  return (
    <>
      <text
        textAnchor="end"
        transform={labelPosition}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.5em"
        fill="none"
        fontSize="14"
      >
        {label}
      </text>
      <text
        textAnchor="end"
        transform={labelPosition}
        stroke="none"
        fontSize="14"
        fill="black"
      >
        {label}
      </text>
    </>
  );
}
