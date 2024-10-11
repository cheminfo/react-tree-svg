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
