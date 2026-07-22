/**
 * Render a label split on newlines as stacked `<tspan>` lines, offset so the
 * block sits above, centered on, or below the baseline.
 * @param props - The multi-line label and its vertical anchoring.
 * @param props.label - Text to draw; each newline starts a new line.
 * @param props.verticalPosition - Anchors the block above, on, or below the baseline.
 * @returns One `<tspan>` per line.
 */
export function MultilineText(props: {
  label: string;
  verticalPosition: 'top' | 'center' | 'bottom';
}) {
  const { label, verticalPosition } = props;
  if (!label) return;
  const lines = label.split(/\r?\n/);
  const firstDX =
    verticalPosition === 'top'
      ? 1
      : verticalPosition === 'center'
        ? -lines.length / 2 + 0.5
        : -lines.length;
  return (
    <>
      {lines.map((line, index) => (
        <tspan key={index} x="0" dy={index === 0 ? `${firstDX}em` : '1em'}>
          {line}
        </tspan>
      ))}
    </>
  );
}
