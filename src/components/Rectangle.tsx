/**
 * Thin wrapper around the SVG `<rect>` element, forwarding all props.
 * @param props - Any SVG rect attributes (size, position, style…).
 * @returns The `<rect>` element.
 */
export function Rectangle(props) {
  return <rect {...props} />;
}
