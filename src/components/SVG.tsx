/**
 * Inject an already-rendered SVG fragment (e.g. a molecule) into the tree.
 * @param props - Wrapper for the raw SVG markup.
 * @param props.svg - The SVG fragment to inject; renders nothing when empty.
 * @returns A group holding the injected markup, or null when there is nothing to draw.
 */
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
