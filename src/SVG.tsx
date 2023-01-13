export function SVG(props: { svg: string }) {
  if (!props.svg) return null;

  return (
    <g
      dangerouslySetInnerHTML={{
        __html: props.svg,
      }}
    />
  );
}
