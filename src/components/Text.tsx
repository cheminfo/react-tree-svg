import { MultilineText } from './MultilineText.tsx';

/**
 * Draw a text label at a point, painted twice (a light halo stroke under a solid
 * fill) so it stays readable over arrows and molecules.
 * @param props - Label content and placement.
 * @param props.x - Horizontal anchor coordinate.
 * @param props.y - Vertical anchor coordinate.
 * @param props.label - Text to draw; may contain newlines.
 * @param props.horizontalPosition - Text anchor: start, middle or end.
 * @param props.verticalPosition - Vertical alignment of the text block.
 * @returns The haloed label, as two overlaid `<text>` elements.
 */
export function Text(props: {
  x: number;
  y: number;
  label: string;
  horizontalPosition: 'left' | 'center' | 'right';
  verticalPosition: 'top' | 'center' | 'bottom';
}) {
  const { x, y, label, verticalPosition, horizontalPosition } = props;
  const transform = `translate(${x},${y})`;

  let textAnchor;
  switch (horizontalPosition) {
    case 'left':
      textAnchor = 'start';
      break;
    case 'center':
      textAnchor = 'middle';
      break;
    case 'right':
      textAnchor = 'end';
      break;
    default:
      textAnchor = 'middle';
  }

  return (
    <>
      <text
        textAnchor={textAnchor}
        transform={transform}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.5em"
        fill="none"
        fontSize="14"
      >
        <MultilineText label={label} verticalPosition={verticalPosition} />
      </text>
      <text
        textAnchor={textAnchor}
        transform={transform}
        stroke="none"
        fontSize="14"
        fill="black"
      >
        <MultilineText label={label} verticalPosition={verticalPosition} />
      </text>
    </>
  );
}
